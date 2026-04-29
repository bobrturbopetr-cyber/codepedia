export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        
        // CORS для разработки
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Content-Type': 'application/json'
        };
        
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers });
        }
        
        // ========== API РЕГИСТРАЦИИ ==========
        if (path === '/api/register' && request.method === 'POST') {
            try {
                const { email, password, name } = await request.json();
                
                if (!email || !password) {
                    return new Response(JSON.stringify({ error: 'Email и пароль обязательны' }), { headers, status: 400 });
                }
                
                // Хеширование пароля (в реальном проекте используйте bcrypt через WASM)
                const password_hash = await hashPassword(password);
                
                const stmt = env.DB.prepare(
                    "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)"
                );
                
                const result = await stmt.bind(email, password_hash, name || email.split('@')[0]).run();
                
                return new Response(JSON.stringify({ success: true, userId: result.meta.last_row_id }), { headers });
                
            } catch (error) {
                if (error.message.includes('UNIQUE')) {
                    return new Response(JSON.stringify({ error: 'Пользователь уже существует' }), { headers, status: 409 });
                }
                return new Response(JSON.stringify({ error: error.message }), { headers, status: 500 });
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
                    return new Response(JSON.stringify({ error: 'Пользователь не найден' }), { headers, status: 401 });
                }
                
                // Проверка пароля
                const isValid = await verifyPassword(password, user.password_hash);
                if (!isValid) {
                    return new Response(JSON.stringify({ error: 'Неверный пароль' }), { headers, status: 401 });
                }
                
                // Создаём сессию
                const sessionId = crypto.randomUUID();
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 30); // 30 дней
                
                await env.DB.prepare(
                    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)"
                ).bind(sessionId, user.id, expiresAt.toISOString()).run();
                
                // Обновляем last_login
                await env.DB.prepare(
                    "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?"
                ).bind(user.id).run();
                
                return new Response(JSON.stringify({
                    success: true,
                    sessionId: sessionId,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                }), { headers });
                
            } catch (error) {
                return new Response(JSON.stringify({ error: error.message }), { headers, status: 500 });
            }
        }
        
        // ========== ПРОВЕРКА СЕССИИ ==========
        if (path === '/api/me' && request.method === 'GET') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) {
                return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers, status: 401 });
            }
            
            const session = await env.DB.prepare(
                "SELECT * FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            
            if (!session) {
                return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers, status: 401 });
            }
            
            const user = await env.DB.prepare(
                "SELECT id, email, name, role, created_at FROM users WHERE id = ?"
            ).bind(session.user_id).first();
            
            return new Response(JSON.stringify({ user }), { headers });
        }
        
        // ========== ВЫХОД ==========
        if (path === '/api/logout' && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (sessionId) {
                await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
            }
            return new Response(JSON.stringify({ success: true }), { headers });
        }
        
        // ========== СОХРАНЕНИЕ НАСТРОЕК ==========
        if (path === '/api/settings' && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) {
                return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers, status: 401 });
            }
            
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            
            if (!session) {
                return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers, status: 401 });
            }
            
            const { theme, language, notifications } = await request.json();
            
            await env.DB.prepare(
                `INSERT INTO user_settings (user_id, theme, language, notifications) 
                 VALUES (?, ?, ?, ?) 
                 ON CONFLICT(user_id) DO UPDATE SET 
                 theme = excluded.theme, 
                 language = excluded.language, 
                 notifications = excluded.notifications`
            ).bind(session.user_id, theme || 'light', language || 'ru', notifications !== false).run();
            
            return new Response(JSON.stringify({ success: true }), { headers });
        }
        
        // ========== ПОЛУЧЕНИЕ НАСТРОЕК ==========
        if (path === '/api/settings' && request.method === 'GET') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) {
                return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers, status: 401 });
            }
            
            const session = await env.DB.prepare(
                "SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP"
            ).bind(sessionId).first();
            
            if (!session) {
                return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers, status: 401 });
            }
            
            const settings = await env.DB.prepare(
                "SELECT theme, language, notifications FROM user_settings WHERE user_id = ?"
            ).bind(session.user_id).first();
            
            return new Response(JSON.stringify({ settings: settings || { theme: 'light', language: 'ru', notifications: true } }), { headers });
        }
        
        // Прокси статики (index.html и т.д.)
        // ... тут остаётся ваш стандартный статический хостинг
        
        return new Response('Not found', { status: 404 });
    }
};

async function hashPassword(password) {
    // В продакшене используйте bcrypt через WASM
    // Пока простой хеш (не для продакшена!)
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'codepedia-salt');
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function verifyPassword(password, hash) {
    const newHash = await hashPassword(password);
    return newHash === hash;
}
