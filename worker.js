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
        
        // Preflight запросы
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }
        
        // ========== API РЕГИСТРАЦИИ И ВХОДА ==========
        
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
        
        // ========== API ДЛЯ СТАТЕЙ ==========
        
        // Получение всех статей (доступно всем)
        if (path === '/api/articles' && request.method === 'GET') {
            const articles = await env.DB.prepare(
                "SELECT id, title, slug, category, difficulty, excerpt, author_name, date, views FROM articles WHERE status = 'published' OR status IS NULL ORDER BY date DESC"
            ).all();
            
            return new Response(JSON.stringify(articles.results), { 
                headers: corsHeaders 
            });
        }
        
        // Получение одной статьи по slug (доступно всем)
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
        
        // Создание статьи — ТОЛЬКО ДЛЯ ЗАРЕГИСТРИРОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ
        if (path === '/api/articles' && request.method === 'POST') {
            // Проверяем сессию
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) {
                return new Response(JSON.stringify({ error: 'Необходимо войти в систему' }), { 
                    headers: corsHeaders, status: 401 
                });
            }
            
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            
            if (!session) {
                return new Response(JSON.stringify({ error: 'Сессия истекла. Войдите снова.' }), { 
                    headers: corsHeaders, status: 401 
                });
            }
            
            // Получаем данные пользователя
            const user = await env.DB.prepare(
                "SELECT id, name FROM users WHERE id = ?"
            ).bind(session.user_id).first();
            
            if (!user) {
                return new Response(JSON.stringify({ error: 'Пользователь не найден' }), { 
                    headers: corsHeaders, status: 401 
                });
            }
            
            // ✅ Любой зарегистрированный пользователь может создать статью
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
                
                // Сохраняем статью
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
        
        // ========== ОТДАЧА СТАТИЧЕСКИХ ФАЙЛОВ ==========
        
        // Маппинг путей к файлам
        const staticFiles = {
            '/': 'index.html',
            '/index.html': 'index.html',
            '/create.html': 'create.html',
            '/article.html': 'article.html',
            '/style.css': 'style.css',
            '/script.js': 'script.js',
            '/privacy.html': 'privacy.html'
        };
        
        // Если запрос к известному статическому файлу
        if (staticFiles[path]) {
            const fileName = staticFiles[path];
            
            // Пытаемся получить файл из Assets
            try {
                const asset = await env.ASSETS.fetch(new Request(`https://fake-host/${fileName}`));
                if (asset.status === 200) {
                    return asset;
                }
            } catch(e) {
                // Если Assets нет, возвращаем HTML-заглушку для основных страниц
                if (fileName === 'index.html') {
                    return new Response(`<!DOCTYPE html>
<html>
<head><title>Codepedia</title><meta charset="UTF-8"></head>
<body>
<h1>📚 Codepedia</h1>
<p>Добро пожаловать в энциклопедию программирования!</p>
<p><a href="/api/login">Войти</a> | <a href="/create.html">Создать статью</a></p>
<button onclick="test()">Тест API</button>
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
                if (fileName === 'create.html') {
                    return new Response(`<!DOCTYPE html>
<html>
<head><title>Создать статью</title><meta charset="UTF-8"></head>
<body>
<h1>📝 Создать статью</h1>
<p>Форма создания статьи будет здесь.</p>
<p><a href="/">На главную</a></p>
</body>
</html>`, {
                        headers: { 'Content-Type': 'text/html' }
                    });
                }
                if (fileName === 'style.css') {
                    return new Response(`body { font-family: sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
h1 { color: #ff6b00; }
a { color: #0645ad; }`, {
                        headers: { 'Content-Type': 'text/css' }
                    });
                }
            }
        }
        
        // Если путь начинается с /articles/ — отдаём заглушку
        if (path.startsWith('/articles/')) {
            return new Response(`<!DOCTYPE html>
<html>
<head><title>Статья</title><meta charset="UTF-8"></head>
<body>
<h1>📖 Чтение статьи</h1>
<p>Содержание статьи загружается через API.</p>
<p><a href="/">На главную</a></p>
</body>
</html>`, {
                headers: { 'Content-Type': 'text/html' }
            });
        }
        
        // Если ничего не подошло — 404
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
