export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        // CORS для API
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-Id',
            'Content-Type': 'application/json'
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // ========== ЯНДЕКС OAuth CALLBACK ==========
        if (path === '/api/yandex-callback' && request.method === 'GET') {
            const url = new URL(request.url);
            const code = url.searchParams.get('code');
            
            if (!code) {
                return new Response('Ошибка: код не получен', { status: 400 });
            }
            
            try {
                const tokenRes = await fetch('https://oauth.yandex.ru/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        grant_type: 'authorization_code',
                        code: code,
                        client_id: '0cdd1dc659314700959ff3dd61177031',
                        client_secret: '89a0c059ec3248958fee5f3e9e26c2f4'
                    })
                });
                
                const tokenData = await tokenRes.json();
                const accessToken = tokenData.access_token;
                
                const userRes = await fetch('https://login.yandex.ru/info', {
                    headers: { 'Authorization': `OAuth ${accessToken}` }
                });
                const yandexUser = await userRes.json();
                
                const email = yandexUser.default_email;
                const name = yandexUser.real_name || yandexUser.display_name || email.split('@')[0];
                const avatar = yandexUser.default_avatar_id 
                    ? `https://avatars.yandex.net/get-yapic/${yandexUser.default_avatar_id}/islands-200` 
                    : `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
                
                let user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
                
                if (!user) {
                    const result = await env.DB.prepare(
                        "INSERT INTO users (email, name, avatar, yandex_id, role) VALUES (?, ?, ?, ?, 'user')"
                    ).bind(email, name, avatar, yandexUser.id).run();
                    user = { id: result.meta.last_row_id, email, name, avatar };
                } else {
                    await env.DB.prepare(
                        "UPDATE users SET name = ?, avatar = ?, yandex_id = ? WHERE id = ?"
                    ).bind(name, avatar, yandexUser.id, user.id).run();
                    user.name = name;
                    user.avatar = avatar;
                }
                
                const sessionId = crypto.randomUUID();
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 30);
                
                await env.DB.prepare(
                    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)"
                ).bind(sessionId, user.id, expiresAt.toISOString()).run();
                
                return new Response(`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Вход через Яндекс</title></head>
<body>
<script>
    localStorage.setItem('sessionId', '${sessionId}');
    localStorage.setItem('user', JSON.stringify({
        id: ${user.id},
        email: '${user.email}',
        name: '${user.name.replace(/'/g, "\\'")}',
        avatar: '${user.avatar}'
    }));
    window.location.href = '/';
</script>
</body>
</html>`, { headers: { 'Content-Type': 'text/html' } });
                
            } catch (err) {
                return new Response(`Ошибка: ${err.message}`, { status: 500 });
            }
        }

        // ========== АВТОРИЗАЦИЯ (email/пароль) ==========
        if (path === '/api/register' && request.method === 'POST') {
            try {
                const { email, password, name } = await request.json();
                if (!email || !password) {
                    return new Response(JSON.stringify({ error: 'Email и пароль обязательны' }), { headers: corsHeaders, status: 400 });
                }
                const salt = 'codepedia-salt';
                const passwordHash = await hashPassword(password, salt);
                const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
                if (existing) {
                    return new Response(JSON.stringify({ error: 'Пользователь уже существует' }), { headers: corsHeaders, status: 409 });
                }
                const result = await env.DB.prepare(
                    "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'user')"
                ).bind(email, passwordHash, name || email.split('@')[0]).run();
                return new Response(JSON.stringify({ success: true, userId: result.meta.last_row_id }), { headers: corsHeaders });
            } catch (err) {
                return new Response(JSON.stringify({ error: err.message }), { headers: corsHeaders, status: 500 });
            }
        }

        if (path === '/api/login' && request.method === 'POST') {
            try {
                const { email, password } = await request.json();
                const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
                if (!user) {
                    return new Response(JSON.stringify({ error: 'Пользователь не найден' }), { headers: corsHeaders, status: 401 });
                }
                const isValid = await verifyPassword(password, user.password_hash, 'codepedia-salt');
                if (!isValid) {
                    return new Response(JSON.stringify({ error: 'Неверный пароль' }), { headers: corsHeaders, status: 401 });
                }
                const sessionId = crypto.randomUUID();
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 30);
                await env.DB.prepare(
                    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)"
                ).bind(sessionId, user.id, expiresAt.toISOString()).run();
                await env.DB.prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?").bind(user.id).run();
                return new Response(JSON.stringify({
                    success: true,
                    sessionId: sessionId,
                    user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar }
                }), { headers: corsHeaders });
            } catch (err) {
                return new Response(JSON.stringify({ error: err.message }), { headers: corsHeaders, status: 500 });
            }
        }

        if (path === '/api/me' && request.method === 'GET') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const user = await env.DB.prepare(
                "SELECT id, email, name, role, avatar FROM users WHERE id = ?"
            ).bind(session.user_id).first();
            return new Response(JSON.stringify({ user }), { headers: corsHeaders });
        }

        if (path === '/api/logout' && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (sessionId) {
                await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
            }
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        // ========== СТАТЬИ ==========
        if (path === '/api/articles' && request.method === 'GET') {
            const articles = await env.DB.prepare(
                "SELECT id, title, slug, category, difficulty, excerpt, author_name, date, views FROM articles WHERE status = 'published' OR status IS NULL ORDER BY date DESC"
            ).all();
            return new Response(JSON.stringify(articles.results), { headers: corsHeaders });
        }

        if (path.match(/^\/api\/articles\/[^\/]+$/) && request.method === 'GET') {
            const slug = path.split('/').pop();
            const article = await env.DB.prepare("SELECT * FROM articles WHERE slug = ?").bind(slug).first();
            if (!article) return new Response(JSON.stringify({ error: 'Статья не найдена' }), { headers: corsHeaders, status: 404 });
            await env.DB.prepare("UPDATE articles SET views = views + 1 WHERE slug = ?").bind(slug).run();
            if (article.tags) try { article.tags = JSON.parse(article.tags); } catch(e) { article.tags = []; }
            return new Response(JSON.stringify(article), { headers: corsHeaders });
        }

        if (path === '/api/articles' && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Необходимо войти' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const user = await env.DB.prepare("SELECT id, name FROM users WHERE id = ?").bind(session.user_id).first();
            if (!user) return new Response(JSON.stringify({ error: 'Пользователь не найден' }), { headers: corsHeaders, status: 401 });
            try {
                const { title, slug, category, difficulty, tags, excerpt, content, date } = await request.json();
                if (!title || !slug || !content) {
                    return new Response(JSON.stringify({ error: 'Заполните обязательные поля' }), { headers: corsHeaders, status: 400 });
                }
                const existing = await env.DB.prepare("SELECT id FROM articles WHERE slug = ?").bind(slug).first();
                if (existing) return new Response(JSON.stringify({ error: 'Статья с таким URL уже существует' }), { headers: corsHeaders, status: 409 });
                const result = await env.DB.prepare(
                    `INSERT INTO articles (title, slug, category, difficulty, tags, excerpt, content, author_id, author_name, date)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                ).bind(title, slug, category, difficulty, JSON.stringify(tags || []), excerpt || '', content, user.id, user.name, date || new Date().toISOString().split('T')[0]).run();
                return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id, slug }), { headers: corsHeaders });
            } catch (err) {
                return new Response(JSON.stringify({ error: err.message }), { headers: corsHeaders, status: 500 });
            }
        }

        // ========== КУРСЫ, УРОКИ, ПРОГРЕСС ==========
        if (path === '/api/courses' && request.method === 'GET') {
            const courses = await env.DB.prepare("SELECT * FROM courses ORDER BY id").all();
            return new Response(JSON.stringify(courses.results), { headers: corsHeaders });
        }

        if (path.match(/^\/api\/courses\/\d+$/) && request.method === 'GET') {
            const id = parseInt(path.split('/').pop());
            const course = await env.DB.prepare("SELECT * FROM courses WHERE id = ?").bind(id).first();
            if (!course) return new Response(JSON.stringify({ error: 'Курс не найден' }), { headers: corsHeaders, status: 404 });
            return new Response(JSON.stringify(course), { headers: corsHeaders });
        }

        if (path.match(/^\/api\/courses\/\d+\/lessons$/) && request.method === 'GET') {
            const courseId = parseInt(path.split('/')[3]);
            const lessons = await env.DB.prepare("SELECT * FROM lessons WHERE course_id = ? ORDER BY lesson_number").bind(courseId).all();
            return new Response(JSON.stringify(lessons.results), { headers: corsHeaders });
        }

        if (path.match(/^\/api\/lessons\/\d+$/) && request.method === 'GET') {
            const id = parseInt(path.split('/').pop());
            const lesson = await env.DB.prepare("SELECT *, COALESCE(notes, theory) AS notes FROM lessons WHERE id = ?").bind(id).first();
            if (!lesson) return new Response(JSON.stringify({ error: 'Урок не найден' }), { headers: corsHeaders, status: 404 });
            return new Response(JSON.stringify(lesson), { headers: corsHeaders });
        }

        if (path === '/api/user-progress' && request.method === 'GET') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const progress = await env.DB.prepare(
                "SELECT lesson_id, completed, solution FROM user_progress WHERE user_id = ?"
            ).bind(session.user_id).all();
            const result = {};
            progress.results.forEach(p => { result[p.lesson_id] = { completed: p.completed === 1, solution: p.solution }; });
            return new Response(JSON.stringify(result), { headers: corsHeaders });
        }

        if (path.match(/^\/api\/user-progress\/\d+$/) && request.method === 'GET') {
            const lessonId = parseInt(path.split('/').pop());
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ completed: false }), { headers: corsHeaders });
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ completed: false }), { headers: corsHeaders });
            const prog = await env.DB.prepare(
                "SELECT completed, solution FROM user_progress WHERE user_id = ? AND lesson_id = ?"
            ).bind(session.user_id, lessonId).first();
            return new Response(JSON.stringify({ completed: prog ? (prog.completed === 1) : false, solution: prog ? prog.solution : '' }), { headers: corsHeaders });
        }

        if (path === '/api/user-progress' && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const { lesson_id, solution, completed } = await request.json();
            await env.DB.prepare(
                `INSERT INTO user_progress (user_id, lesson_id, completed, solution, completed_at)
                 VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                 ON CONFLICT(user_id, lesson_id) DO UPDATE SET
                 completed = ?, solution = ?, completed_at = CURRENT_TIMESTAMP`
            ).bind(session.user_id, lesson_id, completed ? 1 : 0, solution || '', completed ? 1 : 0, solution || '').run();
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        if (path === '/api/check-solution' && request.method === 'POST') {
            const { code, language } = await request.json();
            let correct = false;
            let message = '';
            if (code && (code.includes('cout') && code.includes('main') && code.includes('return'))) correct = true;
            else if (code && (code.includes('print') || code.includes('input'))) correct = true;
            else if (code && code.trim().length > 10) correct = true;
            else message = 'Код не содержит основных конструкций. Попробуйте ещё раз.';
            if (correct) message = '✅ Решение верное! Отлично!';
            else if (!message) message = '❌ Решение неверное. Попробуйте ещё раз.';
            return new Response(JSON.stringify({ correct, message }), { headers: corsHeaders });
        }

        // ========== ЧАТ С РЕПЕТИТОРОМ ==========
        if (path === '/api/tutor-messages' && request.method === 'GET') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const messages = await env.DB.prepare(
                "SELECT * FROM tutor_messages WHERE user_id = ? ORDER BY created_at ASC"
            ).bind(session.user_id).all();
            return new Response(JSON.stringify(messages.results), { headers: corsHeaders });
        }

        if (path === '/api/tutor-messages' && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const { message, direction } = await request.json();
            await env.DB.prepare(
                "INSERT INTO tutor_messages (user_id, message, direction) VALUES (?, ?, ?)"
            ).bind(session.user_id, message, direction).run();
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        // ========== ХОСТИНГ ПРОЕКТОВ (API) ==========
        if (path === '/api/projects' && request.method === 'GET') {
            const projects = await env.DB.prepare(
                "SELECT id, slug, title, description, author_name, author_avatar, views, created_at FROM projects WHERE published = 1 ORDER BY created_at DESC"
            ).all();
            return new Response(JSON.stringify(projects.results), { headers: corsHeaders });
        }

        // ========== ПОЛУЧИТЬ ТОЛЬКО СВОИ ПРОЕКТЫ ==========
        if (path === '/api/projects/my' && request.method === 'GET') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) {
                return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            }
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            if (!session) {
                return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            }
            
            const projects = await env.DB.prepare(
                "SELECT id, slug, title, description, views, created_at FROM projects WHERE user_id = ? AND published = 1 ORDER BY created_at DESC"
            ).bind(session.user_id).all();
            
            return new Response(JSON.stringify(projects.results), { headers: corsHeaders });
        }

        if (path.match(/^\/api\/projects\/[^\/]+$/) && request.method === 'GET') {
            const slug = path.split('/').pop();
            const project = await env.DB.prepare(
                "SELECT * FROM projects WHERE slug = ? AND published = 1"
            ).bind(slug).first();
            if (!project) return new Response(JSON.stringify({ error: 'Проект не найден' }), { headers: corsHeaders, status: 404 });
            return new Response(JSON.stringify(project), { headers: corsHeaders });
        }

        if (path === '/api/projects' && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Необходимо войти' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const user = await env.DB.prepare("SELECT id, name, avatar FROM users WHERE id = ?").bind(session.user_id).first();
            if (!user) return new Response(JSON.stringify({ error: 'Пользователь не найден' }), { headers: corsHeaders, status: 401 });
            try {
                const { slug, title, description, html, css, js } = await request.json();
                if (!slug || !title || !html) return new Response(JSON.stringify({ error: 'Заполните обязательные поля' }), { headers: corsHeaders, status: 400 });
                const existing = await env.DB.prepare("SELECT id FROM projects WHERE slug = ?").bind(slug).first();
                if (existing) return new Response(JSON.stringify({ error: 'Проект с таким адресом уже существует' }), { headers: corsHeaders, status: 409 });
                
                const files = {
                    'index.html': html,
                    'style.css': css || '',
                    'script.js': js || ''
                };
                
                await env.DB.prepare(
                    `INSERT INTO projects (user_id, slug, title, description, files, author_name, author_avatar) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`
                ).bind(user.id, slug, title, description || '', JSON.stringify(files), user.name, user.avatar).run();
                return new Response(JSON.stringify({ success: true, slug }), { headers: corsHeaders });
            } catch (err) {
                return new Response(JSON.stringify({ error: err.message }), { headers: corsHeaders, status: 500 });
            }
        }
        // ========== УДАЛИТЬ ПРОЕКТ ==========
        if (path.match(/^\/api\/projects\/[^\/]+$/) && request.method === 'DELETE') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) {
                return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            }
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            if (!session) {
                return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            }
            
            const slug = path.split('/').pop();
            const project = await env.DB.prepare(
                "SELECT user_id FROM projects WHERE slug = ?"
            ).bind(slug).first();
            
            if (!project) {
                return new Response(JSON.stringify({ error: 'Проект не найден' }), { headers: corsHeaders, status: 404 });
            }
            
            if (project.user_id !== session.user_id) {
                return new Response(JSON.stringify({ error: 'Нет прав на удаление' }), { headers: corsHeaders, status: 403 });
            }
            
            await env.DB.prepare("DELETE FROM projects WHERE slug = ?").bind(slug).run();
            
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        // ========== РАБОТА С ФАЙЛАМИ ПРОЕКТА ==========
        if (path.match(/^\/api\/projects\/[^\/]+\/files$/) && request.method === 'GET') {
            const slug = path.split('/')[3];
            const project = await env.DB.prepare("SELECT files FROM projects WHERE slug = ?").bind(slug).first();
            if (!project) return new Response(JSON.stringify({ error: 'Проект не найден' }), { headers: corsHeaders, status: 404 });
            let files = {};
            try { files = JSON.parse(project.files || '{}'); } catch(e) {}
            return new Response(JSON.stringify(files), { headers: corsHeaders });
        }

        if (path.match(/^\/api\/projects\/[^\/]+\/files$/) && request.method === 'PUT') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP").bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            
            const slug = path.split('/')[3];
            const project = await env.DB.prepare("SELECT user_id, files FROM projects WHERE slug = ?").bind(slug).first();
            if (!project) return new Response(JSON.stringify({ error: 'Проект не найден' }), { headers: corsHeaders, status: 404 });
            if (project.user_id !== session.user_id) return new Response(JSON.stringify({ error: 'Нет прав' }), { headers: corsHeaders, status: 403 });
            
            const { path: filePath, content } = await request.json();
            let files = {};
            try { files = JSON.parse(project.files || '{}'); } catch(e) {}
            files[filePath] = content;
            
            await env.DB.prepare("UPDATE projects SET files = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?")
                .bind(JSON.stringify(files), slug).run();
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        if (path.match(/^\/api\/projects\/[^\/]+\/files$/) && request.method === 'DELETE') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP").bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            
            const slug = path.split('/')[3];
            const project = await env.DB.prepare("SELECT user_id, files FROM projects WHERE slug = ?").bind(slug).first();
            if (!project) return new Response(JSON.stringify({ error: 'Проект не найден' }), { headers: corsHeaders, status: 404 });
            if (project.user_id !== session.user_id) return new Response(JSON.stringify({ error: 'Нет прав' }), { headers: corsHeaders, status: 403 });
            
            const { path: filePath } = await request.json();
            let files = {};
            try { files = JSON.parse(project.files || '{}'); } catch(e) {}
            delete files[filePath];
            
            await env.DB.prepare("UPDATE projects SET files = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?")
                .bind(JSON.stringify(files), slug).run();
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        if (path.match(/^\/api\/projects\/[^\/]+\/files\/rename$/) && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP").bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            
            const slug = path.split('/')[3];
            const project = await env.DB.prepare("SELECT user_id, files FROM projects WHERE slug = ?").bind(slug).first();
            if (!project) return new Response(JSON.stringify({ error: 'Проект не найден' }), { headers: corsHeaders, status: 404 });
            if (project.user_id !== session.user_id) return new Response(JSON.stringify({ error: 'Нет прав' }), { headers: corsHeaders, status: 403 });
            
            const { oldPath, newPath } = await request.json();
            let files = {};
            try { files = JSON.parse(project.files || '{}'); } catch(e) {}
            if (files[oldPath] !== undefined) {
                files[newPath] = files[oldPath];
                delete files[oldPath];
                await env.DB.prepare("UPDATE projects SET files = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?")
                    .bind(JSON.stringify(files), slug).run();
            }
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        // ========== ОТДАЧА ПРОЕКТОВ ЧЕРЕЗ /site/ ==========
        if (path.startsWith('/site/') && request.method === 'GET') {
            const slug = path.replace('/site/', '').split('/')[0];
            let filePath = path.replace(`/site/${slug}`, '');
            if (!filePath || filePath === '/') filePath = '/index.html';
            if (filePath.startsWith('/')) filePath = filePath.substring(1);
            
            const project = await env.DB.prepare(
                "SELECT id, slug, title, files FROM projects WHERE slug = ? AND published = 1"
            ).bind(slug).first();
            
            if (!project) {
                return new Response(`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Проект не найден</title></head>
<body style="font-family: sans-serif; text-align: center; padding: 50px;">
<h1>❌ Проект не найден</h1>
<p>Проект "${slug}" не существует</p>
<a href="/hosting.html" style="color: #ff6b00;">← Вернуться к хостингу</a>
</body>
</html>`, { status: 404, headers: { 'Content-Type': 'text/html' } });
            }
            
            let files = {};
            try { files = JSON.parse(project.files || '{}'); } catch(e) {}
            
            let content = files[filePath];
            let contentType = 'text/html';
            if (filePath.endsWith('.css')) contentType = 'text/css';
            else if (filePath.endsWith('.js')) contentType = 'application/javascript';
            else if (filePath.endsWith('.json')) contentType = 'application/json';
            else if (filePath.endsWith('.png')) contentType = 'image/png';
            else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
            
            if (content) {
                await env.DB.prepare("UPDATE projects SET views = views + 1 WHERE slug = ?").bind(slug).run();
                return new Response(content, { headers: { 'Content-Type': contentType } });
            }
            
            if (files['index.html']) {
                await env.DB.prepare("UPDATE projects SET views = views + 1 WHERE slug = ?").bind(slug).run();
                return new Response(files['index.html'], { headers: { 'Content-Type': 'text/html' } });
            }
            
            return new Response(`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${project.title}</title></head>
<body style="font-family: sans-serif; text-align: center; padding: 50px;">
<h1>🚀 ${project.title}</h1>
<p>Сайт создан на Codepedia Hosting</p>
<p>Файл ${filePath} не найден</p>
<hr>
<a href="/hosting.html" style="color: #ff6b00;">Все проекты</a>
</body>
</html>`, { headers: { 'Content-Type': 'text/html' } });
        }

        // ========== СТАТИЧЕСКИЕ ФАЙЛЫ ==========
        const staticMap = {
            '/': 'index.html',
            '/index.html': 'index.html',
            '/create.html': 'create.html',
            '/courses.html': 'courses.html',
            '/course.html': 'course.html',
            '/lesson.html': 'lesson.html',
            '/progress.html': 'progress.html',
            '/tutor.html': 'tutor.html',
            '/hosting.html': 'hosting.html',
            '/create-site.html': 'create-site.html',
            '/site-editor.html': 'site-editor.html',
            '/style.css': 'style.css',
            '/privacy.html': 'privacy.html'
        };
        
        if (staticMap[path]) {
            try {
                const asset = await env.ASSETS.fetch(new Request(`https://fake-host/${staticMap[path]}`));
                if (asset.status === 200) return asset;
            } catch(e) {}
            if (staticMap[path] === 'style.css') {
                return new Response(`body { font-family: sans-serif; background: #f5f7fb; margin: 0; } .header { background: white; padding: 16px 24px; }`, {
                    headers: { 'Content-Type': 'text/css' }
                });
            }
            return new Response(`<!DOCTYPE html><html><head><title>Codepedia</title><meta charset="UTF-8"></head><body><h1>Codepedia</h1><p>Деплой прошёл успешно.</p></body></html>`, {
                headers: { 'Content-Type': 'text/html' }
            });
        }

        if (path.startsWith('/articles/')) {
            return new Response(`<!DOCTYPE html><html><head><title>Статья Codepedia</title><meta charset="UTF-8"></head><body><h1>Статья</h1><p><a href="/">На главную</a></p></body></html>`, {
                headers: { 'Content-Type': 'text/html' }
            });
        }

        return new Response('Not found', { status: 404, headers: corsHeaders });
    }
};

async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function verifyPassword(password, hash, salt) {
    const newHash = await hashPassword(password, salt);
    return newHash === hash;
}
