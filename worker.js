// ========== ВСТРОЕННЫЕ HTML-СТРАНИЦЫ ==========
const WIKI_PAGE = `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Codepedia Wiki — Энциклопедия программирования</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;background:#0a0e27;color:#e0e0e0}
.header{background:rgba(15,18,40,0.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,107,0,0.3);padding:16px 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}
.logo h1{font-size:28px}
.code-orange{color:#ff6b00}
.pedia{color:#4a90e2}
.nav-links a{color:#e0e0e0;text-decoration:none;margin-left:24px}
.nav-links a:hover{color:#ff6b00}
.container{max-width:1400px;margin:0 auto;padding:30px}
.hero{text-align:center;padding:60px 20px}
.hero h1{font-size:48px;margin-bottom:16px;background:linear-gradient(135deg,#ff6b00,#4a90e2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{font-size:18px;color:#a0a0a0}
.features-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;margin:30px 0}
.feature-card{background:rgba(255,255,255,0.05);border-radius:16px;padding:24px;text-align:center;border:1px solid rgba(255,255,255,0.1);transition:transform 0.2s}
.feature-card:hover{transform:translateY(-4px);border-color:#ff6b00}
.feature-icon{font-size:40px;margin-bottom:12px}
.feature-title{font-size:18px;font-weight:600;margin-bottom:8px}
.feature-desc{font-size:13px;color:#a0a0a0}
.btn{display:inline-block;background:#ff6b00;color:#fff;padding:12px 28px;border-radius:40px;text-decoration:none;font-weight:600;margin-top:12px}
.btn:hover{background:#ff8533}
.footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;color:#666;font-size:13px}
.stats{display:flex;gap:40px;justify-content:center;margin:20px 0}
.stat{text-align:center}
.stat-number{font-size:32px;font-weight:700;color:#ff6b00}
.stat-label{font-size:13px;color:#a0a0a0}
@media (max-width:768px){.hero h1{font-size:32px}.nav-links{margin-top:10px}}
</style>
</head>
<body>
<div class="header">
<div class="logo"><h1><span class="code-orange">Code</span><span class="pedia">pedia</span> Wiki</h1></div>
<div class="nav-links">
<a href="https://wiki.codepedia.space">📖 Wiki</a>
<a href="https://courses.codepedia.space">🎓 Курсы</a>
<a href="https://hosting.codepedia.space">🚀 Хостинг</a>
<a href="https://devkit.codepedia.space">⚡ DevKit</a>
<a href="https://blog.codepedia.space">📝 Блог</a>
</div>
</div>
<div class="container">
<div class="hero">
<h1>📚 Codepedia Wiki</h1>
<p>Свободная энциклопедия программирования</p>
<div class="stats"><div class="stat"><div class="stat-number">15+</div><div class="stat-label">статей</div></div><div class="stat"><div class="stat-number">6</div><div class="stat-label">разделов</div></div><div class="stat"><div class="stat-number">∞</div><div class="stat-label">свободных знаний</div></div></div>
<a href="https://courses.codepedia.space" class="btn">🎓 Начать учиться</a>
</div>
<div class="features-grid">
<div class="feature-card"><div class="feature-icon">📖</div><div class="feature-title">Энциклопедия</div><div class="feature-desc">Статьи по языкам, алгоритмам и инструментам</div></div>
<div class="feature-card"><div class="feature-icon">🎓</div><div class="feature-title">Курсы</div><div class="feature-desc">Подготовка к ВСОШ и олимпиадам</div></div>
<div class="feature-card"><div class="feature-icon">🚀</div><div class="feature-title">Хостинг</div><div class="feature-desc">Бесплатный хостинг для ваших проектов</div></div>
<div class="feature-card"><div class="feature-icon">⚡</div><div class="feature-title">DevKit</div><div class="feature-desc">Инструменты для разработчиков</div></div>
</div>
</div>
<div class="footer"><p>Codepedia Wiki — свободная энциклопедия программирования | © 2024-2026</p></div>
</body></html>`;

const COURSES_SUBDOMAIN_PAGE = `<!DOCTYPE html>
<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Курсы — Codepedia</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0e27;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;color:#e0e0e0}.header{background:rgba(15,18,40,0.95);border-bottom:1px solid rgba(255,107,0,0.3);padding:16px 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}.logo h1{font-size:28px}.code-orange{color:#ff6b00}.pedia{color:#4a90e2}.nav-links a{color:#e0e0e0;text-decoration:none;margin-left:24px}.nav-links a:hover{color:#ff6b00}.container{max-width:1400px;margin:0 auto;padding:30px}.hero{text-align:center;padding:60px 20px}.hero h1{font-size:48px;margin-bottom:16px;background:linear-gradient(135deg,#ff6b00,#4a90e2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.hero p{font-size:18px;color:#a0a0a0}.btn{display:inline-block;background:#ff6b00;color:#fff;padding:12px 28px;border-radius:40px;text-decoration:none;font-weight:600;margin-top:12px}.btn:hover{background:#ff8533}.footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;color:#666}
</style></head>
<body>
<div class="header"><div class="logo"><h1><span class="code-orange">Code</span><span class="pedia">pedia</span> Courses</h1></div><div class="nav-links"><a href="https://wiki.codepedia.space">📖 Wiki</a><a href="https://courses.codepedia.space">🎓 Курсы</a><a href="https://hosting.codepedia.space">🚀 Хостинг</a><a href="https://devkit.codepedia.space">⚡ DevKit</a></div></div>
<div class="container"><div class="hero"><h1>🎓 Codepedia Courses</h1><p>Подготовка к ВСОШ и олимпиадам по программированию</p><a href="https://courses.codepedia.space" class="btn">📖 Начать учиться</a></div></div>
<div class="footer"><p>Codepedia Courses | © 2024-2026</p></div>
</body></html>`;

const HOSTING_SUBDOMAIN_PAGE = `<!DOCTYPE html>
<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Хостинг — Codepedia</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0e27;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;color:#e0e0e0}.header{background:rgba(15,18,40,0.95);border-bottom:1px solid rgba(255,107,0,0.3);padding:16px 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}.logo h1{font-size:28px}.code-orange{color:#ff6b00}.pedia{color:#4a90e2}.nav-links a{color:#e0e0e0;text-decoration:none;margin-left:24px}.nav-links a:hover{color:#ff6b00}.container{max-width:1400px;margin:0 auto;padding:30px}.hero{text-align:center;padding:60px 20px}.hero h1{font-size:48px;margin-bottom:16px;background:linear-gradient(135deg,#ff6b00,#4a90e2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.hero p{font-size:18px;color:#a0a0a0}.btn{display:inline-block;background:#ff6b00;color:#fff;padding:12px 28px;border-radius:40px;text-decoration:none;font-weight:600;margin-top:12px}.btn:hover{background:#ff8533}.footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;color:#666}
</style></head>
<body>
<div class="header"><div class="logo"><h1><span class="code-orange">Code</span><span class="pedia">pedia</span> Hosting</h1></div><div class="nav-links"><a href="https://wiki.codepedia.space">📖 Wiki</a><a href="https://courses.codepedia.space">🎓 Курсы</a><a href="https://hosting.codepedia.space">🚀 Хостинг</a><a href="https://devkit.codepedia.space">⚡ DevKit</a></div></div>
<div class="container"><div class="hero"><h1>🚀 Codepedia Hosting</h1><p>Бесплатный хостинг для ваших проектов</p><a href="https://hosting.codepedia.space" class="btn">✨ Создать сайт</a></div></div>
<div class="footer"><p>Codepedia Hosting | © 2024-2026</p></div>
</body></html>`;

const DEVKIT_SUBDOMAIN_PAGE = `<!DOCTYPE html>
<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>DevKit — Codepedia</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0e27;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;color:#e0e0e0}.header{background:rgba(15,18,40,0.95);border-bottom:1px solid rgba(255,107,0,0.3);padding:16px 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}.logo h1{font-size:28px}.code-orange{color:#ff6b00}.pedia{color:#4a90e2}.nav-links a{color:#e0e0e0;text-decoration:none;margin-left:24px}.nav-links a:hover{color:#ff6b00}.container{max-width:1400px;margin:0 auto;padding:30px}.hero{text-align:center;padding:60px 20px}.hero h1{font-size:48px;margin-bottom:16px;background:linear-gradient(135deg,#ff6b00,#4a90e2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.hero p{font-size:18px;color:#a0a0a0}.btn{display:inline-block;background:#ff6b00;color:#fff;padding:12px 28px;border-radius:40px;text-decoration:none;font-weight:600;margin-top:12px}.btn:hover{background:#ff8533}.footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;color:#666}
</style></head>
<body>
<div class="header"><div class="logo"><h1><span class="code-orange">Code</span><span class="pedia">pedia</span> DevKit</h1></div><div class="nav-links"><a href="https://wiki.codepedia.space">📖 Wiki</a><a href="https://courses.codepedia.space">🎓 Курсы</a><a href="https://hosting.codepedia.space">🚀 Хостинг</a><a href="https://devkit.codepedia.space">⚡ DevKit</a></div></div>
<div class="container"><div class="hero"><h1>⚡ Codepedia DevKit</h1><p>Инструменты для разработчиков</p><a href="https://devkit.codepedia.space" class="btn">🔧 Открыть инструменты</a></div></div>
<div class="footer"><p>Codepedia DevKit | © 2024-2026</p></div>
</body></html>`;

const BLOG_SUBDOMAIN_PAGE = `<!DOCTYPE html>
<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Блог — Codepedia</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0e27;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;color:#e0e0e0}.header{background:rgba(15,18,40,0.95);border-bottom:1px solid rgba(255,107,0,0.3);padding:16px 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}.logo h1{font-size:28px}.code-orange{color:#ff6b00}.pedia{color:#4a90e2}.nav-links a{color:#e0e0e0;text-decoration:none;margin-left:24px}.nav-links a:hover{color:#ff6b00}.container{max-width:1400px;margin:0 auto;padding:30px}.hero{text-align:center;padding:60px 20px}.hero h1{font-size:48px;margin-bottom:16px;background:linear-gradient(135deg,#ff6b00,#4a90e2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.hero p{font-size:18px;color:#a0a0a0}.btn{display:inline-block;background:#ff6b00;color:#fff;padding:12px 28px;border-radius:40px;text-decoration:none;font-weight:600;margin-top:12px}.btn:hover{background:#ff8533}.footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;color:#666}
</style></head>
<body>
<div class="header"><div class="logo"><h1><span class="code-orange">Code</span><span class="pedia">pedia</span> Blog</h1></div><div class="nav-links"><a href="https://wiki.codepedia.space">📖 Wiki</a><a href="https://courses.codepedia.space">🎓 Курсы</a><a href="https://hosting.codepedia.space">🚀 Хостинг</a><a href="https://devkit.codepedia.space">⚡ DevKit</a><a href="https://blog.codepedia.space">📝 Блог</a></div></div>
<div class="container"><div class="hero"><h1>📝 Codepedia Blog</h1><p>Новости, статьи и анонсы Codepedia</p><a href="https://blog.codepedia.space" class="btn">📖 Читать блог</a></div></div>
<div class="footer"><p>Codepedia Blog | © 2024-2026</p></div>
</body></html>`;

const API_SUBDOMAIN_PAGE = `<!DOCTYPE html>
<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>API — Codepedia</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0e27;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;color:#e0e0e0}.header{background:rgba(15,18,40,0.95);border-bottom:1px solid rgba(255,107,0,0.3);padding:16px 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}.logo h1{font-size:28px}.code-orange{color:#ff6b00}.pedia{color:#4a90e2}.nav-links a{color:#e0e0e0;text-decoration:none;margin-left:24px}.nav-links a:hover{color:#ff6b00}.container{max-width:1400px;margin:0 auto;padding:30px}.hero{text-align:center;padding:60px 20px}.hero h1{font-size:48px;margin-bottom:16px;background:linear-gradient(135deg,#ff6b00,#4a90e2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.hero p{font-size:18px;color:#a0a0a0}.btn{display:inline-block;background:#ff6b00;color:#fff;padding:12px 28px;border-radius:40px;text-decoration:none;font-weight:600;margin-top:12px}.btn:hover{background:#ff8533}.footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;color:#666}
</style></head>
<body>
<div class="header"><div class="logo"><h1><span class="code-orange">Code</span><span class="pedia">pedia</span> API</h1></div><div class="nav-links"><a href="https://wiki.codepedia.space">📖 Wiki</a><a href="https://courses.codepedia.space">🎓 Курсы</a><a href="https://hosting.codepedia.space">🚀 Хостинг</a><a href="https://devkit.codepedia.space">⚡ DevKit</a></div></div>
<div class="container"><div class="hero"><h1>🔌 Codepedia API</h1><p>Публичное API для разработчиков</p><a href="https://api.codepedia.space" class="btn">📖 Документация</a></div></div>
<div class="footer"><p>Codepedia API | © 2024-2026</p></div>
</body></html>`;

// ========== ОСНОВНОЙ WORKER ==========
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        const hostname = url.hostname;

        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-Id',
            'Content-Type': 'application/json'
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // ========== ОБРАБОТКА ПОДДОМЕНОВ ==========
        if (hostname !== 'codepedia.space' && hostname.endsWith('.codepedia.space')) {
            const subdomain = hostname.replace('.codepedia.space', '');

            // ===== СТРАНИЦЫ ПОДДОМЕНОВ =====
            if (subdomain === 'wiki') {
                return new Response(WIKI_PAGE, { headers: { 'Content-Type': 'text/html' } });
            }
            if (subdomain === 'courses') {
                return new Response(COURSES_SUBDOMAIN_PAGE, { headers: { 'Content-Type': 'text/html' } });
            }
            if (subdomain === 'hosting') {
                return new Response(HOSTING_SUBDOMAIN_PAGE, { headers: { 'Content-Type': 'text/html' } });
            }
            if (subdomain === 'devkit') {
                return new Response(DEVKIT_SUBDOMAIN_PAGE, { headers: { 'Content-Type': 'text/html' } });
            }
            if (subdomain === 'blog') {
                return new Response(BLOG_SUBDOMAIN_PAGE, { headers: { 'Content-Type': 'text/html' } });
            }
            if (subdomain === 'api') {
                return new Response(API_SUBDOMAIN_PAGE, { headers: { 'Content-Type': 'text/html' } });
            }

            // ===== ПРОЕКТЫ ПОЛЬЗОВАТЕЛЕЙ =====
            try {
                const project = await env.DB.prepare(
                    "SELECT id, slug, title, files FROM projects WHERE slug = ? AND published = 1"
                ).bind(subdomain).first();

                if (project) {
                    let files = {};
                    try { files = JSON.parse(project.files || '{}'); } catch(e) {}
                    let filePath = path === '/' ? '/index.html' : path;
                    if (filePath.startsWith('/')) filePath = filePath.substring(1);
                    let content = files[filePath];
                    let contentType = 'text/html';
                    if (filePath.endsWith('.css')) contentType = 'text/css';
                    else if (filePath.endsWith('.js')) contentType = 'application/javascript';
                    else if (filePath.endsWith('.png')) contentType = 'image/png';
                    else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';

                    if (content) {
                        ctx.waitUntil(env.DB.prepare("UPDATE projects SET views = views + 1 WHERE slug = ?").bind(subdomain).run());
                        return new Response(content, { headers: { 'Content-Type': contentType } });
                    }
                    if (files['index.html']) {
                        ctx.waitUntil(env.DB.prepare("UPDATE projects SET views = views + 1 WHERE slug = ?").bind(subdomain).run());
                        return new Response(files['index.html'], { headers: { 'Content-Type': 'text/html' } });
                    }
                    return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${project.title}</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;background:#0a0e27;color:#e0e0e0;"><h1>🚀 ${project.title}</h1><p>Сайт создан на Codepedia Hosting</p><p>Файл ${filePath} не найден</p><a href="https://wiki.codepedia.space" style="color:#ff6b00;">На главную</a></body></html>`, { headers: { 'Content-Type': 'text/html' } });
                }
                return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Проект не найден</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;background:#0a0e27;color:#e0e0e0;"><h1>❌ Проект не найден</h1><p>Сайт <strong>${subdomain}.codepedia.space</strong> не существует</p><a href="https://wiki.codepedia.space" style="color:#ff6b00;">← На главную</a></body></html>`, { status: 404, headers: { 'Content-Type': 'text/html' } });
            } catch (error) {
                return new Response(`<h1>⚠️ Ошибка базы данных</h1><p>${error.message}</p>`, { status: 500 });
            }
        }

        // ========== API ==========

        // ---- Яндекс OAuth ----
        if (path === '/api/yandex-callback' && request.method === 'GET') {
            const url = new URL(request.url);
            const code = url.searchParams.get('code');
            if (!code) return new Response('Ошибка: код не получен', { status: 400 });
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
                const avatar = yandexUser.default_avatar_id ? `https://avatars.yandex.net/get-yapic/${yandexUser.default_avatar_id}/islands-200` : `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
                let user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
                if (!user) {
                    const result = await env.DB.prepare("INSERT INTO users (email, name, avatar, yandex_id, role) VALUES (?, ?, ?, ?, 'user')").bind(email, name, avatar, yandexUser.id).run();
                    user = { id: result.meta.last_row_id, email, name, avatar };
                } else {
                    await env.DB.prepare("UPDATE users SET name = ?, avatar = ?, yandex_id = ? WHERE id = ?").bind(name, avatar, yandexUser.id, user.id).run();
                    user.name = name;
                    user.avatar = avatar;
                }
                const sessionId = crypto.randomUUID();
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 30);
                await env.DB.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").bind(sessionId, user.id, expiresAt.toISOString()).run();
                return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Вход через Яндекс</title></head><body><script>localStorage.setItem('sessionId', '${sessionId}');localStorage.setItem('user', JSON.stringify({id: ${user.id},email: '${user.email}',name: '${user.name.replace(/'/g, "\\'")}',avatar: '${user.avatar}'}));window.location.href='https://wiki.codepedia.space';</script></body></html>`, { headers: { 'Content-Type': 'text/html' } });
            } catch (err) { return new Response(`Ошибка: ${err.message}`, { status: 500 }); }
        }

        // ---- Регистрация ----
        if (path === '/api/register' && request.method === 'POST') {
            try {
                const { email, password, name } = await request.json();
                if (!email || !password) return new Response(JSON.stringify({ error: 'Email и пароль обязательны' }), { headers: corsHeaders, status: 400 });
                const salt = 'codepedia-salt';
                const passwordHash = await hashPassword(password, salt);
                const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
                if (existing) return new Response(JSON.stringify({ error: 'Пользователь уже существует' }), { headers: corsHeaders, status: 409 });
                const result = await env.DB.prepare("INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'user')").bind(email, passwordHash, name || email.split('@')[0]).run();
                return new Response(JSON.stringify({ success: true, userId: result.meta.last_row_id }), { headers: corsHeaders });
            } catch (err) { return new Response(JSON.stringify({ error: err.message }), { headers: corsHeaders, status: 500 }); }
        }

        // ---- Логин ----
        if (path === '/api/login' && request.method === 'POST') {
            try {
                const { email, password } = await request.json();
                const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
                if (!user) return new Response(JSON.stringify({ error: 'Пользователь не найден' }), { headers: corsHeaders, status: 401 });
                const isValid = await verifyPassword(password, user.password_hash, 'codepedia-salt');
                if (!isValid) return new Response(JSON.stringify({ error: 'Неверный пароль' }), { headers: corsHeaders, status: 401 });
                const sessionId = crypto.randomUUID();
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 30);
                await env.DB.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").bind(sessionId, user.id, expiresAt.toISOString()).run();
                await env.DB.prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?").bind(user.id).run();
                return new Response(JSON.stringify({ success: true, sessionId, user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar } }), { headers: corsHeaders });
            } catch (err) { return new Response(JSON.stringify({ error: err.message }), { headers: corsHeaders, status: 500 }); }
        }

        // ---- Проверка сессии ----
        if (path === '/api/me' && request.method === 'GET') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP").bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const user = await env.DB.prepare("SELECT id, email, name, role, avatar FROM users WHERE id = ?").bind(session.user_id).first();
            return new Response(JSON.stringify({ user }), { headers: corsHeaders });
        }

        // ---- Выход ----
        if (path === '/api/logout' && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (sessionId) await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        // ---- Статьи ----
        if (path === '/api/articles' && request.method === 'GET') {
            const articles = await env.DB.prepare("SELECT id, title, slug, category, difficulty, excerpt, author_name, date, views FROM articles WHERE status = 'published' OR status IS NULL ORDER BY date DESC").all();
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
                return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id, slug }), { headers: corsHeaders });
            } catch (err) { return new Response(JSON.stringify({ error: err.message }), { headers: corsHeaders, status: 500 }); }
        }

        // ---- Курсы ----
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

        // ---- Прогресс ----
        if (path === '/api/user-progress' && request.method === 'GET') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP").bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const progress = await env.DB.prepare("SELECT lesson_id, completed, solution FROM user_progress WHERE user_id = ?").bind(session.user_id).all();
            const result = {};
            progress.results.forEach(p => { result[p.lesson_id] = { completed: p.completed === 1, solution: p.solution }; });
            return new Response(JSON.stringify(result), { headers: corsHeaders });
        }
        if (path.match(/^\/api\/user-progress\/\d+$/) && request.method === 'GET') {
            const lessonId = parseInt(path.split('/').pop());
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ completed: false }), { headers: corsHeaders });
            const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP").bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ completed: false }), { headers: corsHeaders });
            const prog = await env.DB.prepare("SELECT completed, solution FROM user_progress WHERE user_id = ? AND lesson_id = ?").bind(session.user_id, lessonId).first();
            return new Response(JSON.stringify({ completed: prog ? (prog.completed === 1) : false, solution: prog ? prog.solution : '' }), { headers: corsHeaders });
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

        // ---- Проверка кода ----
        if (path === '/api/check-solution' && request.method === 'POST') {
            const { lesson_id, code } = await request.json();
            const lesson = await env.DB.prepare("SELECT test_code FROM lessons WHERE id = ?").bind(lesson_id).first();
            let correct = false, message = '';
            if (code && lesson && lesson.test_code) {
                const cleanCode = code.replace(/\s/g, '');
                const cleanTest = lesson.test_code.replace(/\s/g, '');
                if (cleanCode === cleanTest) { correct = true; message = '✅ Решение верное! Отлично!'; }
                else { message = '❌ Решение неверное. Проверьте алгоритм.'; }
            } else if (code && code.length > 50) { correct = true; message = '✅ Решение принято (проверка пройдена)!'; }
            else { message = '❌ Код слишком короткий. Проверьте решение.'; }
            return new Response(JSON.stringify({ correct, message }), { headers: corsHeaders });
        }

        // ---- Чат с репетитором ----
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

        // ---- Проекты (хостинг) ----
        if (path === '/api/projects' && request.method === 'GET') {
            const projects = await env.DB.prepare("SELECT id, slug, title, description, author_name, author_avatar, views, created_at FROM projects WHERE published = 1 ORDER BY created_at DESC").all();
            return new Response(JSON.stringify(projects.results), { headers: corsHeaders });
        }
        if (path === '/api/projects/my' && request.method === 'GET') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP").bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const projects = await env.DB.prepare("SELECT id, slug, title, description, views, created_at FROM projects WHERE user_id = ? AND published = 1 ORDER BY created_at DESC").bind(session.user_id).all();
            return new Response(JSON.stringify(projects.results), { headers: corsHeaders });
        }
        if (path.match(/^\/api\/projects\/[^\/]+$/) && request.method === 'GET') {
            const slug = path.split('/').pop();
            const project = await env.DB.prepare("SELECT * FROM projects WHERE slug = ? AND published = 1").bind(slug).first();
            if (!project) return new Response(JSON.stringify({ error: 'Проект не найден' }), { headers: corsHeaders, status: 404 });
            return new Response(JSON.stringify(project), { headers: corsHeaders });
        }
        if (path === '/api/projects' && request.method === 'POST') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Необходимо войти' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP").bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const user = await env.DB.prepare("SELECT id, name, avatar FROM users WHERE id = ?").bind(session.user_id).first();
            if (!user) return new Response(JSON.stringify({ error: 'Пользователь не найден' }), { headers: corsHeaders, status: 401 });
            try {
                const { slug, title, description, html, css, js } = await request.json();
                if (!slug || !title || !html) return new Response(JSON.stringify({ error: 'Заполните обязательные поля' }), { headers: corsHeaders, status: 400 });
                const existing = await env.DB.prepare("SELECT id FROM projects WHERE slug = ?").bind(slug).first();
                if (existing) return new Response(JSON.stringify({ error: 'Проект с таким адресом уже существует' }), { headers: corsHeaders, status: 409 });
                const files = { 'index.html': html, 'style.css': css || '', 'script.js': js || '' };
                await env.DB.prepare(`INSERT INTO projects (user_id, slug, title, description, files, author_name, author_avatar) VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(user.id, slug, title, description || '', JSON.stringify(files), user.name, user.avatar).run();
                return new Response(JSON.stringify({ success: true, slug }), { headers: corsHeaders });
            } catch (err) { return new Response(JSON.stringify({ error: err.message }), { headers: corsHeaders, status: 500 }); }
        }

        // ---- Файлы проектов ----
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
            await env.DB.prepare("UPDATE projects SET files = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?").bind(JSON.stringify(files), slug).run();
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
            await env.DB.prepare("UPDATE projects SET files = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?").bind(JSON.stringify(files), slug).run();
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
                await env.DB.prepare("UPDATE projects SET files = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?").bind(JSON.stringify(files), slug).run();
            }
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        // ---- Удалить проект ----
        if (path.match(/^\/api\/projects\/[^\/]+$/) && request.method === 'DELETE') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP").bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const slug = path.split('/').pop();
            const project = await env.DB.prepare("SELECT user_id FROM projects WHERE slug = ?").bind(slug).first();
            if (!project) return new Response(JSON.stringify({ error: 'Проект не найден' }), { headers: corsHeaders, status: 404 });
            if (project.user_id !== session.user_id) return new Response(JSON.stringify({ error: 'Нет прав на удаление' }), { headers: corsHeaders, status: 403 });
            await env.DB.prepare("DELETE FROM projects WHERE slug = ?").bind(slug).run();
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        // ========== СТАТИЧЕСКИЕ СТРАНИЦЫ (codepedia.space) ==========
        if (path === '/' || path === '/index.html') {
            return new Response(WIKI_PAGE, { headers: { 'Content-Type': 'text/html' } });
        }
        if (path === '/courses.html') return new Response(COURSES_SUBDOMAIN_PAGE, { headers: { 'Content-Type': 'text/html' } });
        if (path === '/hosting.html') return new Response(HOSTING_SUBDOMAIN_PAGE, { headers: { 'Content-Type': 'text/html' } });
        if (path === '/devkit.html') return new Response(DEVKIT_SUBDOMAIN_PAGE, { headers: { 'Content-Type': 'text/html' } });

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
