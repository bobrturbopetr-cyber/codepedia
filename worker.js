export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-Id',
            'Content-Type': 'application/json'
        };
        
        if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
        
        // ========== API РЕГИСТРАЦИИ И ВХОДА ==========
        
        if (path === '/api/register' && request.method === 'POST') {
            try {
                const { email, password, name } = await request.json();
                if (!email || !password) return new Response(JSON.stringify({ error: 'Email и пароль обязательны' }), { headers: corsHeaders, status: 400 });
                const password_hash = await hashPassword(password);
                const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
                if (existing) return new Response(JSON.stringify({ error: 'Пользователь уже существует' }), { headers: corsHeaders, status: 409 });
                const result = await env.DB.prepare("INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'user')").bind(email, password_hash, name || email.split('@')[0]).run();
                return new Response(JSON.stringify({ success: true, userId: result.meta.last_row_id }), { headers: corsHeaders });
            } catch (error) { return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 }); }
        }
        
        if (path === '/api/login' && request.method === 'POST') {
            try {
                const { email, password } = await request.json();
                const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
                if (!user) return new Response(JSON.stringify({ error: 'Пользователь не найден' }), { headers: corsHeaders, status: 401 });
                const isValid = await verifyPassword(password, user.password_hash);
                if (!isValid) return new Response(JSON.stringify({ error: 'Неверный пароль' }), { headers: corsHeaders, status: 401 });
                const sessionId = crypto.randomUUID();
                const expiresAt = new Date(); expiresAt.setDate(expiresAt.getDate() + 30);
                await env.DB.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").bind(sessionId, user.id, expiresAt.toISOString()).run();
                await env.DB.prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?").bind(user.id).run();
                return new Response(JSON.stringify({ success: true, sessionId: sessionId, user: { id: user.id, email: user.email, name: user.name, role: user.role } }), { headers: corsHeaders });
            } catch (error) { return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 }); }
        }
        
        if (path === '/api/me' && request.method === 'GET') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP").bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const user = await env.DB.prepare("SELECT id, email, name, role FROM users WHERE id = ?").bind(session.user_id).first();
            return new Response(JSON.stringify({ user }), { headers: corsHeaders });
        }
        
        if (path === '/api/logout' && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (sessionId) await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }
        
        // ========== API СТАТЕЙ ==========
        
        if (path === '/api/articles' && request.method === 'GET') {
            const articles = await env.DB.prepare("SELECT id, title, slug, category, difficulty, excerpt, author_name, date, views FROM articles WHERE status = 'published' OR status IS NULL ORDER BY date DESC").all();
            return new Response(JSON.stringify(articles.results), { headers: corsHeaders });
        }
        
        if (path.startsWith('/api/articles/') && request.method === 'GET') {
            const slug = path.replace('/api/articles/', '');
            const article = await env.DB.prepare("SELECT * FROM articles WHERE slug = ?").bind(slug).first();
            if (!article) return new Response(JSON.stringify({ error: 'Статья не найдена' }), { headers: corsHeaders, status: 404 });
            await env.DB.prepare("UPDATE articles SET views = views + 1 WHERE slug = ?").bind(slug).run();
            if (article.tags) try { article.tags = JSON.parse(article.tags); } catch(e) { article.tags = []; }
            return new Response(JSON.stringify(article), { headers: corsHeaders });
        }
        
        if (path === '/api/articles' && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Необходимо войти в систему' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP").bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const user = await env.DB.prepare("SELECT id, name FROM users WHERE id = ?").bind(session.user_id).first();
            if (!user) return new Response(JSON.stringify({ error: 'Пользователь не найден' }), { headers: corsHeaders, status: 401 });
            try {
                const { title, slug, category, difficulty, tags, excerpt, content, date } = await request.json();
                if (!title || !slug || !content) return new Response(JSON.stringify({ error: 'Заполните обязательные поля' }), { headers: corsHeaders, status: 400 });
                const existing = await env.DB.prepare("SELECT id FROM articles WHERE slug = ?").bind(slug).first();
                if (existing) return new Response(JSON.stringify({ error: 'Статья с таким URL уже существует' }), { headers: corsHeaders, status: 409 });
                const result = await env.DB.prepare(`INSERT INTO articles (title, slug, category, difficulty, tags, excerpt, content, author_id, author_name, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(title, slug, category, difficulty, JSON.stringify(tags || []), excerpt || '', content, user.id, user.name, date || new Date().toISOString().split('T')[0]).run();
                return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id, slug: slug }), { headers: corsHeaders });
            } catch (error) { return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 }); }
        }
        
        // ========== API КУРСОВ ==========
        
        if (path === '/api/courses' && request.method === 'GET') {
            const courses = await env.DB.prepare("SELECT * FROM courses ORDER BY id").all();
            return new Response(JSON.stringify(courses.results), { headers: corsHeaders });
        }
        
        if (path.match(/^\/api\/courses\/\d+$/) && request.method === 'GET') {
            const id = path.split('/').pop();
            const course = await env.DB.prepare("SELECT * FROM courses WHERE id = ?").bind(id).first();
            if (!course) return new Response(JSON.stringify({ error: 'Курс не найден' }), { headers: corsHeaders, status: 404 });
            return new Response(JSON.stringify(course), { headers: corsHeaders });
        }
        
        if (path.match(/^\/api\/courses\/\d+\/lessons$/) && request.method === 'GET') {
            const courseId = path.split('/')[3];
            const lessons = await env.DB.prepare("SELECT * FROM lessons WHERE course_id = ? ORDER BY lesson_number").bind(courseId).all();
            return new Response(JSON.stringify(lessons.results), { headers: corsHeaders });
        }
        
        if (path.match(/^\/api\/lessons\/\d+$/) && request.method === 'GET') {
            const id = path.split('/').pop();
            const lesson = await env.DB.prepare("SELECT * FROM lessons WHERE id = ?").bind(id).first();
            if (!lesson) return new Response(JSON.stringify({ error: 'Урок не найден' }), { headers: corsHeaders, status: 404 });
            return new Response(JSON.stringify(lesson), { headers: corsHeaders });
        }
        
        // ========== ПРОГРЕСС ПОЛЬЗОВАТЕЛЯ ==========
        
        if (path === '/api/user-progress' && request.method === 'GET') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP").bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const progress = await env.DB.prepare("SELECT lesson_id, completed, solution FROM user_progress WHERE user_id = ?").bind(session.user_id).all();
            const result = {};
            progress.results.forEach(p => { result[p.lesson_id] = { completed: p.completed, solution: p.solution }; });
            return new Response(JSON.stringify(result), { headers: corsHeaders });
        }
        
        if (path === '/api/user-progress' && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP").bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const { lesson_id, solution, completed } = await request.json();
            await env.DB.prepare(`INSERT INTO user_progress (user_id, lesson_id, completed, solution, completed_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP) ON CONFLICT(user_id, lesson_id) DO UPDATE SET completed = ?, solution = ?, completed_at = CURRENT_TIMESTAMP`).bind(session.user_id, lesson_id, completed ? 1 : 0, solution || '', completed ? 1 : 0, solution || '').run();
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }
        
        if (path === '/api/check-solution' && request.method === 'POST') {
            const { solution } = await request.json();
            // Простая проверка — можно заменить на реальную компиляцию
            return new Response(JSON.stringify({ correct: solution && solution.length > 0 }), { headers: corsHeaders });
        }
        
        // ========== СООБЩЕНИЯ С РЕПЕТИТОРОМ ==========
        
        if (path === '/api/tutor-messages' && request.method === 'GET') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP").bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const messages = await env.DB.prepare("SELECT * FROM tutor_messages WHERE user_id = ? ORDER BY created_at ASC").bind(session.user_id).all();
            return new Response(JSON.stringify(messages.results), { headers: corsHeaders });
        }
        
        if (path === '/api/tutor-messages' && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP").bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const { message, direction } = await request.json();
            await env.DB.prepare("INSERT INTO tutor_messages (user_id, message, direction) VALUES (?, ?, ?)").bind(session.user_id, message, direction).run();
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }
        
        // ========== СТАТИЧЕСКИЕ ФАЙЛЫ ==========
        
        const staticFiles = {
            '/': 'index.html', '/index.html': 'index.html', '/create.html': 'create.html',
            '/courses.html': 'courses.html', '/course.html': 'course.html', '/lesson.html': 'lesson.html',
            '/progress.html': 'progress.html', '/tutor.html': 'tutor.html',
            '/style.css': 'style.css', '/script.js': 'script.js', '/privacy.html': 'privacy.html'
        };
        
        if (staticFiles[path]) {
            try {
                const asset = await env.ASSETS.fetch(new Request(`https://fake-host/${staticFiles[path]}`));
                if (asset.status === 200) return asset;
            } catch(e) {}
            // Простая заглушка, если нет assets
            if (staticFiles[path] === 'index.html') return new Response(`<!DOCTYPE html><html><head><title>Codepedia</title><meta charset="UTF-8"></head><body><h1>Codepedia</h1><p>Сайт работает. API: <a href="/api/login">/api/login</a></p></body></html>`, { headers: { 'Content-Type': 'text/html' } });
            if (staticFiles[path] === 'style.css') return new Response(`body { font-family: sans-serif; }`, { headers: { 'Content-Type': 'text/css' } });
        }
        
        if (path.startsWith('/articles/')) {
            return new Response(`<!DOCTYPE html><html><head><title>Статья</title><meta charset="UTF-8"></head><body><h1>Статья</h1><p><a href="/">На главную</a></p></body></html>`, { headers: { 'Content-Type': 'text/html' } });
        }
        
        return new Response('Not found', { status: 404 });
    }
};

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'codepedia-salt');
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function verifyPassword(password, hash) {
    const newHash = await hashPassword(password);
    return newHash === hash;
}
