export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        
        // CORS заголовки для API
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-Id',
            'Content-Type': 'application/json'
        };
        
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }
        
        // ========== API РЕГИСТРАЦИИ И ВХОДА (ваш старый код) ==========
        
        // Регистрация
        if (path === '/api/register' && request.method === 'POST') {
            try {
                const { email, password, name } = await request.json();
                
                if (!email || !password) {
                    return new Response(JSON.stringify({ error: 'Email и пароль обязательны' }), { 
                        headers: corsHeaders, status: 400 
                    });
                }
                
                const password_hash = await hashPassword(password);
                
                const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
                if (existing) {
                    return new Response(JSON.stringify({ error: 'Пользователь уже существует' }), { 
                        headers: corsHeaders, status: 409 
                    });
                }
                
                const result = await env.DB.prepare(
                    "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'user')"
                ).bind(email, password_hash, name || email.split('@')[0]).run();
                
                return new Response(JSON.stringify({ success: true, userId: result.meta.last_row_id }), { 
                    headers: corsHeaders 
                });
                
            } catch (error) {
                return new Response(JSON.stringify({ error: error.message }), { 
                    headers: corsHeaders, status: 500 
                });
            }
        }
        
        // Вход
        if (path === '/api/login' && request.method === 'POST') {
            try {
                const { email, password } = await request.json();
                
                const user = await env.DB.prepare(
                    "SELECT * FROM users WHERE email = ?"
                ).bind(email).first();
                
                if (!user) {
                    return new Response(JSON.stringify({ error: 'Пользователь не найден' }), { 
                        headers: corsHeaders, status: 401 
                    });
                }
                
                const isValid = await verifyPassword(password, user.password_hash);
                if (!isValid) {
                    return new Response(JSON.stringify({ error: 'Неверный пароль' }), { 
                        headers: corsHeaders, status: 401 
                    });
                }
                
                const sessionId = crypto.randomUUID();
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 30);
                
                await env.DB.prepare(
                    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)"
                ).bind(sessionId, user.id, expiresAt.toISOString()).run();
                
                await env.DB.prepare(
                    "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?"
                ).bind(user.id).run();
                
                return new Response(JSON.stringify({
                    success: true,
                    sessionId: sessionId,
                    user: { id: user.id, email: user.email, name: user.name, role: user.role }
                }), { headers: corsHeaders });
                
            } catch (error) {
                return new Response(JSON.stringify({ error: error.message }), { 
                    headers: corsHeaders, status: 500 
                });
            }
        }
        
        // Проверка сессии
        if (path === '/api/me' && request.method === 'GET') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) {
                return new Response(JSON.stringify({ error: 'Не авторизован' }), { 
                    headers: corsHeaders, status: 401 
                });
            }
            
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            
            if (!session) {
                return new Response(JSON.stringify({ error: 'Сессия истекла' }), { 
                    headers: corsHeaders, status: 401 
                });
            }
            
            const user = await env.DB.prepare(
                "SELECT id, email, name, role FROM users WHERE id = ?"
            ).bind(session.user_id).first();
            
            return new Response(JSON.stringify({ user }), { headers: corsHeaders });
        }
        
        // Выход
        if (path === '/api/logout' && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (sessionId) {
                await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
            }
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }
        
        // ========== ПОЛУЧЕНИЕ СТАТИЧЕСКИХ ФАЙЛОВ (HTML, CSS) ==========
        // Это новая, добавленная часть, чтобы сайт открывался
        
        let filePath = path === '/' ? '/index.html' : path;
        
        // Список разрешённых файлов для безопасности
        const allowedFiles = ['/index.html', '/style.css', '/privacy.html'];
        
        if (allowedFiles.includes(filePath)) {
            // В реальном проекте здесь должен быть код для чтения файлов из asset-хранилища
            // Для демонстрации вернём тестовую страницу
            return new Response(`<!DOCTYPE html>
        // ========== API ДЛЯ СТАТЕЙ ==========
        
        // Создание статьи (только для авторизованных)
        if (path === '/api/articles' && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) {
                return new Response(JSON.stringify({ error: 'Не авторизован' }), { 
                    headers: corsHeaders, status: 401 
                });
            }
            
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            
            if (!session) {
                return new Response(JSON.stringify({ error: 'Сессия истекла' }), { 
                    headers: corsHeaders, status: 401 
                });
            }
            
            const user = await env.DB.prepare(
                "SELECT id, name, role FROM users WHERE id = ?"
            ).bind(session.user_id).first();
            
            if (user.role !== 'admin' && user.role !== 'editor') {
                return new Response(JSON.stringify({ error: 'Недостаточно прав' }), { 
                    headers: corsHeaders, status: 403 
                });
            }
            
            try {
                const { title, slug, category, difficulty, tags, excerpt, content, date } = await request.json();
                
                if (!title || !slug || !content) {
                    return new Response(JSON.stringify({ error: 'Заполните обязательные поля' }), { 
                        headers: corsHeaders, status: 400 
                    });
                }
                
                // Проверка на уникальность slug
                const existing = await env.DB.prepare(
                    "SELECT id FROM articles WHERE slug = ?"
                ).bind(slug).first();
                
                if (existing) {
                    return new Response(JSON.stringify({ error: 'Статья с таким URL уже существует' }), { 
                        headers: corsHeaders, status: 409 
                    });
                }
                
                const result = await env.DB.prepare(
                    `INSERT INTO articles (title, slug, category, difficulty, tags, excerpt, content, author_id, author_name, date) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                ).bind(
                    title, slug, category, difficulty, 
                    JSON.stringify(tags || []), 
                    excerpt || '', 
                    content, 
                    user.id, 
                    user.name, 
                    date || new Date().toISOString().split('T')[0]
                ).run();
                
                return new Response(JSON.stringify({ 
                    success: true, 
                    id: result.meta.last_row_id,
                    slug: slug
                }), { headers: corsHeaders });
                
            } catch (error) {
                return new Response(JSON.stringify({ error: error.message }), { 
                    headers: corsHeaders, status: 500 
                });
            }
        }
        
        // Получение всех статей
        if (path === '/api/articles' && request.method === 'GET') {
            const articles = await env.DB.prepare(
                "SELECT id, title, slug, category, difficulty, excerpt, author_name, date, views FROM articles ORDER BY date DESC"
            ).all();
            
            return new Response(JSON.stringify(articles.results), { 
                headers: corsHeaders 
            });
        }
        
        // Получение одной статьи по slug
        if (path.startsWith('/api/articles/') && request.method === 'GET') {
            const slug = path.replace('/api/articles/', '');
            const article = await env.DB.prepare(
                "SELECT * FROM articles WHERE slug = ?"
            ).bind(slug).first();
            
            if (!article) {
                return new Response(JSON.stringify({ error: 'Статья не найдена' }), { 
                    headers: corsHeaders, status: 404 
                });
            }
            
            // Увеличиваем счётчик просмотров
            await env.DB.prepare(
                "UPDATE articles SET views = views + 1 WHERE slug = ?"
            ).bind(slug).run();
            
            // Преобразуем tags обратно в массив
            if (article.tags) {
                try {
                    article.tags = JSON.parse(article.tags);
                } catch(e) {
                    article.tags = [];
                }
            }
            
            return new Response(JSON.stringify(article), { 
                headers: corsHeaders 
            });
        }
        
        // Обновление статьи
        if (path.startsWith('/api/articles/') && request.method === 'PUT') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) {
                return new Response(JSON.stringify({ error: 'Не авторизован' }), { 
                    headers: corsHeaders, status: 401 
                });
            }
            
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            
            if (!session) {
                return new Response(JSON.stringify({ error: 'Сессия истекла' }), { 
                    headers: corsHeaders, status: 401 
                });
            }
            
            const user = await env.DB.prepare(
                "SELECT role FROM users WHERE id = ?"
            ).bind(session.user_id).first();
            
            if (user.role !== 'admin' && user.role !== 'editor') {
                return new Response(JSON.stringify({ error: 'Недостаточно прав' }), { 
                    headers: corsHeaders, status: 403 
                });
            }
            
            const slug = path.replace('/api/articles/', '');
            const { title, category, difficulty, tags, excerpt, content } = await request.json();
            
            await env.DB.prepare(
                `UPDATE articles SET 
                    title = ?, category = ?, difficulty = ?, 
                    tags = ?, excerpt = ?, content = ?, 
                    updated_at = CURRENT_TIMESTAMP 
                 WHERE slug = ?`
            ).bind(title, category, difficulty, JSON.stringify(tags || []), excerpt || '', content, slug).run();
            
            return new Response(JSON.stringify({ success: true }), { 
                headers: corsHeaders 
            });
        }
        
        // Удаление статьи
        if (path.startsWith('/api/articles/') && request.method === 'DELETE') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) {
                return new Response(JSON.stringify({ error: 'Не авторизован' }), { 
                    headers: corsHeaders, status: 401 
                });
            }
            
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            
            if (!session) {
                return new Response(JSON.stringify({ error: 'Сессия истекла' }), { 
                    headers: corsHeaders, status: 401 
                });
            }
            
            const user = await env.DB.prepare(
                "SELECT role FROM users WHERE id = ?"
            ).bind(session.user_id).first();
            
            if (user.role !== 'admin') {
                return new Response(JSON.stringify({ error: 'Только админ может удалять статьи' }), { 
                    headers: corsHeaders, status: 403 
                });
            }
            
            const slug = path.replace('/api/articles/', '');
            await env.DB.prepare("DELETE FROM articles WHERE slug = ?").bind(slug).run();
            
            return new Response(JSON.stringify({ success: true }), { 
                headers: corsHeaders 
            });
        }
<html>
<head><title>Codepedia</title><meta charset="UTF-8"></head>
<body>
<h1>📚 Codepedia</h1>
<p>API работает! <a href="/api/login">Проверить API</a></p>
<p>Ваш полный <strong>index.html</strong> и <strong>style.css</strong> должны быть загружены как ассеты.</p>
<button onclick="test()">Тест входа</button>
<script>
async function test() {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: '123' })
    });
    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
}
</script>
</body>
</html>`, {
                headers: { 'Content-Type': 'text/html' }
            });
        }
        
        return new Response('Not found', { status: 404, headers: corsHeaders });
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
