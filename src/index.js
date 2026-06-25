import { Router } from 'itty-router';
import { Database } from './db.js';

const router = Router();

// ======== МАРШРУТЫ ВИКИ ========
// Получить все вики
router.get('/api/wikis', async (request, env) => {
    const db = new Database(env);
    try {
        const wikis = await db.getWikis();
        return new Response(JSON.stringify(wikis), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// Создать вики
router.post('/api/wikis', async (request, env) => {
    try {
        const { name, subdomain, description } = await request.json();
        const db = new Database(env);
        
        const existing = await db.getWikiBySubdomain(subdomain);
        if (existing) {
            return new Response(JSON.stringify({ error: 'Поддомен уже занят' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const wiki = await db.createWiki(name, subdomain, description);
        return new Response(JSON.stringify({ 
            message: 'Вики создана!', 
            wiki,
            url: `https://${subdomain}.codepedia.space`
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// Удалить вики
router.delete('/api/wikis/:id', async (request, env) => {
    try {
        const { id } = request.params;
        const db = new Database(env);
        await db.deleteWiki(parseInt(id));
        return new Response(JSON.stringify({ message: 'Вики удалена' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// Получить статьи вики
router.get('/api/wikis/:id/articles', async (request, env) => {
    try {
        const { id } = request.params;
        const db = new Database(env);
        const articles = await db.getArticles(parseInt(id));
        return new Response(JSON.stringify(articles), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// Создать статью
router.post('/api/articles', async (request, env) => {
    try {
        const { title, content, wikiId, author } = await request.json();
        const db = new Database(env);
        const article = await db.createArticle(title, content, wikiId, author || 'anonymous');
        return new Response(JSON.stringify({ 
            message: 'Статья создана!', 
            article 
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// Удалить статью
router.delete('/api/articles/:id', async (request, env) => {
    try {
        const { id } = request.params;
        const db = new Database(env);
        await db.deleteArticle(parseInt(id));
        return new Response(JSON.stringify({ message: 'Статья удалена' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// ======== МАРШРУТЫ ПРОЕКТОВ ========
router.get('/api/projects', async (request, env) => {
    const db = new Database(env);
    try {
        const projects = await db.getProjects();
        return new Response(JSON.stringify(projects), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

router.post('/api/projects', async (request, env) => {
    try {
        const { name, subdomain, description } = await request.json();
        const db = new Database(env);
        const project = await db.createProject(name, subdomain, description);
        return new Response(JSON.stringify({ 
            message: 'Проект создан!', 
            project,
            url: `https://${subdomain}.codepedia.space`
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

router.delete('/api/projects/:id', async (request, env) => {
    try {
        const { id } = request.params;
        const db = new Database(env);
        await db.deleteProject(parseInt(id));
        return new Response(JSON.stringify({ message: 'Проект удален' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

router.get('/api/projects/:id/files', async (request, env) => {
    try {
        const { id } = request.params;
        const db = new Database(env);
        const files = await db.getProjectFiles(parseInt(id));
        return new Response(JSON.stringify(files), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

router.post('/api/projects/:id/files', async (request, env) => {
    try {
        const { id } = request.params;
        const { name, path, size } = await request.json();
        const db = new Database(env);
        const file = await db.addProjectFile(parseInt(id), name, path, size || 0);
        return new Response(JSON.stringify({ message: 'Файл загружен', file }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

router.delete('/api/files/:id', async (request, env) => {
    try {
        const { id } = request.params;
        const db = new Database(env);
        await db.deleteProjectFile(parseInt(id));
        return new Response(JSON.stringify({ message: 'Файл удален' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// ======== МАРШРУТЫ ИГР ========
router.get('/api/games', async (request, env) => {
    const db = new Database(env);
    try {
        const games = await db.getGames();
        return new Response(JSON.stringify(games), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

router.post('/api/games', async (request, env) => {
    try {
        const { name, genre, description, url, image, uploadedBy } = await request.json();
        const db = new Database(env);
        const game = await db.createGame(name, genre, description, url, image, uploadedBy);
        return new Response(JSON.stringify({ message: 'Игра загружена!', game }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

router.delete('/api/games/:id', async (request, env) => {
    try {
        const { id } = request.params;
        const db = new Database(env);
        await db.deleteGame(parseInt(id));
        return new Response(JSON.stringify({ message: 'Игра удалена' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

router.post('/api/games/:id/download', async (request, env) => {
    try {
        const { id } = request.params;
        const db = new Database(env);
        await db.incrementGameDownloads(parseInt(id));
        return new Response(JSON.stringify({ message: 'Скачивание засчитано' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// ======== МАРШРУТЫ ЧАТА ========
router.get('/api/chat/:room', async (request, env) => {
    try {
        const { room } = request.params;
        const db = new Database(env);
        const messages = await db.getMessages(room);
        return new Response(JSON.stringify(messages.reverse()), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

router.post('/api/chat', async (request, env) => {
    try {
        const { room, author, text } = await request.json();
        const db = new Database(env);
        const message = await db.saveMessage(room, author, text);
        return new Response(JSON.stringify({ message: 'Сообщение отправлено', data: message }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// ======== СТАТИЧЕСКИЕ ФАЙЛЫ ========
const HTML_TEMPLATES = {
    'index.html': getIndexHTML,
    'wiki.html': getWikiHTML,
    'hosting.html': getHostingHTML,
    'games.html': getGamesHTML,
    'chat.html': getChatHTML
};

async function serveStatic(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    if (path.startsWith('/api/')) return null;
    
    // Статические файлы
    if (path === '/' || path === '/index.html') {
        return new Response(getIndexHTML(), {
            headers: { 'Content-Type': 'text/html' }
        });
    }
    
    if (path === '/wiki.html') {
        return new Response(getWikiHTML(), {
            headers: { 'Content-Type': 'text/html' }
        });
    }
    
    if (path === '/hosting.html') {
        return new Response(getHostingHTML(), {
            headers: { 'Content-Type': 'text/html' }
        });
    }
    
    if (path === '/games.html') {
        return new Response(getGamesHTML(), {
            headers: { 'Content-Type': 'text/html' }
        });
    }
    
    if (path === '/chat.html') {
        return new Response(getChatHTML(), {
            headers: { 'Content-Type': 'text/html' }
        });
    }
    
    if (path === '/styles.css') {
        return new Response(getStylesCSS(), {
            headers: { 'Content-Type': 'text/css' }
        });
    }
    
    if (path === '/script.js') {
        return new Response(getScriptJS(), {
            headers: { 'Content-Type': 'application/javascript' }
        });
    }
    
    return null;
}

// ======== HTML СТРАНИЦЫ ========
function getIndexHTML() {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodePedia — IT энциклопедия</title>
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="logo">
                <span class="code">Code</span><span class="pedia">Pedia</span>
                <span class="logo-dot">.</span>
            </div>
            <nav class="nav">
                <a href="/" class="active"><i class="fas fa-home"></i> Главная</a>
                <a href="/wiki.html"><i class="fas fa-book"></i> Вики</a>
                <a href="/hosting.html"><i class="fas fa-server"></i> Хостинг</a>
                <a href="/games.html"><i class="fas fa-gamepad"></i> Игры</a>
                <a href="/chat.html"><i class="fas fa-comments"></i> Обсуждения</a>
            </nav>
            <div class="user-actions">
                <button class="btn btn-primary"><i class="fas fa-user-plus"></i> Войти</button>
            </div>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>Добро пожаловать в <span class="code">Code</span><span class="pedia">Pedia</span></h1>
            <p>Энциклопедия для IT-специалистов. Создавайте вики, делитесь знаниями, общайтесь и играйте!</p>
            <div class="hero-stats" id="stats">
                <div class="stat">
                    <span class="number" id="wikiCount">0</span>
                    <span class="label">Вики</span>
                </div>
                <div class="stat">
                    <span class="number" id="projectCount">0</span>
                    <span class="label">Проектов</span>
                </div>
                <div class="stat">
                    <span class="number" id="gameCount">0</span>
                    <span class="label">Игр</span>
                </div>
            </div>
        </div>
    </section>

    <section class="features">
        <div class="container">
            <h2>Что мы предлагаем</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <i class="fas fa-book-open" style="color: #e07c2c;"></i>
                    <h3>IT Wiki</h3>
                    <p>Создавайте свои поддомены вида <strong>название.codepedia.space</strong> и заполняйте статьями</p>
                    <a href="/wiki.html" class="btn btn-outline">Перейти →</a>
                </div>
                <div class="feature-card">
                    <i class="fas fa-folder-open" style="color: #2b6fbf;"></i>
                    <h3>Хостинг + Файловый менеджер</h3>
                    <p>Загружайте, редактируйте и удаляйте файлы. Управляйте своими проектами</p>
                    <a href="/hosting.html" class="btn btn-outline">Перейти →</a>
                </div>
                <div class="feature-card">
                    <i class="fas fa-comments" style="color: #6c5ce7;"></i>
                    <h3>Обсуждения и чаты</h3>
                    <p>Личные сообщения и групповые обсуждения с участниками</p>
                    <a href="/chat.html" class="btn btn-outline">Перейти →</a>
                </div>
                <div class="feature-card">
                    <i class="fas fa-gamepad" style="color: #00b894;"></i>
                    <h3>Игровая платформа</h3>
                    <p>Скачивайте или загружайте свои игры. Игровой каталог постоянно пополняется</p>
                    <a href="/games.html" class="btn btn-outline">Перейти →</a>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>© 2026 <span class="code">Code</span><span class="pedia">Pedia</span> — Все права защищены</p>
            <p><small>Работает на Cloudflare Workers • D1 SQL</small></p>
        </div>
    </footer>

    <script src="/script.js"></script>
</body>
</html>`;
}

// ... (другие HTML страницы вставляются сюда же, я их сократил для читаемости)
// В реальном проекте вставьте все страницы из предыдущего ответа

// Функции для остальных страниц (заглушки, вставьте полные версии)
function getWikiHTML() { return '<!DOCTYPE html><html><head><title>Wiki</title><link rel="stylesheet" href="/styles.css"></head><body><h1>Wiki</h1><script src="/script.js"></script></body></html>'; }
function getHostingHTML() { return '<!DOCTYPE html><html><head><title>Hosting</title><link rel="stylesheet" href="/styles.css"></head><body><h1>Hosting</h1><script src="/script.js"></script></body></html>'; }
function getGamesHTML() { return '<!DOCTYPE html><html><head><title>Games</title><link rel="stylesheet" href="/styles.css"></head><body><h1>Games</h1><script src="/script.js"></script></body></html>'; }
function getChatHTML() { return '<!DOCTYPE html><html><head><title>Chat</title><link rel="stylesheet" href="/styles.css"></head><body><h1>Chat</h1><script src="/script.js"></script></body></html>'; }
function getStylesCSS() { return '/* CSS тут */'; }
function getScriptJS() { return '// JS тут'; }

// ======== ОБРАБОТЧИК ========
export default {
    async fetch(request, env, ctx) {
        // CORS
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }

        try {
            const apiResponse = await router.handle(request, env);
            if (apiResponse) {
                const response = new Response(apiResponse.body, apiResponse);
                response.headers.set('Access-Control-Allow-Origin', '*');
                return response;
            }

            const staticResponse = await serveStatic(request, env);
            if (staticResponse) {
                staticResponse.headers.set('Access-Control-Allow-Origin', '*');
                return staticResponse;
            }

            return new Response('Страница не найдена', { status: 404 });
        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
};
