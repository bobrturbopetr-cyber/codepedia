export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        
        // CORS для API
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-Id',
        };
        
        // Ответ на preflight запросы CORS
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }
        
        // ========== API РЕГИСТРАЦИИ ==========
        if (path === '/api/register' && request.method === 'POST') {
            try {
                const { email, password, name } = await request.json();
                
                if (!email || !password) {
                    return new Response(JSON.stringify({ error: 'Email и пароль обязательны' }), { 
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }, 
                        status: 400 
                    });
                }
                
                // Простой хеш (для демо, в продакшене используйте bcrypt)
                const password_hash = await hashPassword(password);
                
                // Проверяем, существует ли пользователь
                const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
                if (existing) {
                    return new Response(JSON.stringify({ error: 'Пользователь уже существует' }), { 
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }, 
                        status: 409 
                    });
                }
                
                const result = await env.DB.prepare(
                    "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)"
                ).bind(email, password_hash, name || email.split('@')[0]).run();
                
                return new Response(JSON.stringify({ success: true, userId: result.meta.last_row_id }), { 
                    headers: { 'Content-Type': 'application/json', ...corsHeaders } 
                });
                
            } catch (error) {
                console.error('Register error:', error);
                return new Response(JSON.stringify({ error: error.message }), { 
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }, 
                    status: 500 
                });
            }
        }
        
        // ========== API ВХОДА ==========
        if (path === '/api/login' && request.method === 'POST') {
            try {
                const { email, password } = await request.json();
                
                const user = await env.DB.prepare(
                    "SELECT * FROM users WHERE email = ?"
                ).bind(email).first();
                
                if (!user) {
                    return new Response(JSON.stringify({ error: 'Пользователь не найден' }), { 
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }, 
                        status: 401 
                    });
                }
                
                const isValid = await verifyPassword(password, user.password_hash);
                if (!isValid) {
                    return new Response(JSON.stringify({ error: 'Неверный пароль' }), { 
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }, 
                        status: 401 
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
                }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
                
            } catch (error) {
                console.error('Login error:', error);
                return new Response(JSON.stringify({ error: error.message }), { 
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }, 
                    status: 500 
                });
            }
        }
        
        // ========== ПРОВЕРКА СЕССИИ ==========
        if (path === '/api/me' && request.method === 'GET') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) {
                return new Response(JSON.stringify({ error: 'Не авторизован' }), { 
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }, 
                    status: 401 
                });
            }
            
            const session = await env.DB.prepare(
                "SELECT * FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            
            if (!session) {
                return new Response(JSON.stringify({ error: 'Сессия истекла' }), { 
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }, 
                    status: 401 
                });
            }
            
            const user = await env.DB.prepare(
                "SELECT id, email, name, role, created_at FROM users WHERE id = ?"
            ).bind(session.user_id).first();
            
            return new Response(JSON.stringify({ user }), { 
                headers: { 'Content-Type': 'application/json', ...corsHeaders } 
            });
        }
        
        // ========== ВЫХОД ==========
        if (path === '/api/logout' && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (sessionId) {
                await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
            }
            return new Response(JSON.stringify({ success: true }), { 
                headers: { 'Content-Type': 'application/json', ...corsHeaders } 
            });
        }
        
        // ========== ОБРАБОТКА СТАТИЧЕСКИХ ФАЙЛОВ ==========
        // Если запрос не к API — отдаём статические файлы
        
        // Для корневого пути — index.html
        let filePath = path === '/' ? '/index.html' : path;
        
        // Маппинг путей к файлам
        const staticFiles = {
            '/': 'index.html',
            '/index.html': 'index.html',
            '/style.css': 'style.css',
            '/script.js': 'script.js',
            '/privacy.html': 'privacy.html',
        };
        
        // Если путь есть в маппинге или это файл из articles/
        let fileToServe = staticFiles[filePath];
        
        if (!fileToServe && filePath.startsWith('/articles/')) {
            fileToServe = filePath.substring(1); // убираем первый слеш
        }
        
        if (fileToServe) {
            try {
                // Пытаемся получить файл из окружения Workers Assets
                // Если у вас есть статические файлы как Assets
                const file = await env.ASSETS.fetch(request);
                if (file.ok) return file;
            } catch(e) {
                // Если Assets нет — возвращаем 404
            }
        }
        
        // Если ничего не найдено — 404
        return new Response('Not found', { status: 404, headers: corsHeaders });
    }
};

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'codepedia-salt-2024');
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function verifyPassword(password, hash) {
    const newHash = await hashPassword(password);
    return newHash === hash;
}
