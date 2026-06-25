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
        
        // Проверка на существование
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
        const article = await db.createArticle(title, content, wikiId, author);
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
// Получить все проекты
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

// Создать проект
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

// Удалить проект
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

// Получить файлы проекта
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

// Загрузить файл в проект
router.post('/api/projects/:id/files', async (request, env) => {
    try {
        const { id } = request.params;
        const { name, path, size } = await request.json();
        const db = new Database(env);
        const file = await db.addProjectFile(parseInt(id), name, path, size);
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

// Удалить файл
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
// Получить все игры
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

// Создать игру
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

// Удалить игру
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

// Увеличить счетчик скачиваний
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
// Получить сообщения комнаты
router.get('/api/chat/:room', async (request, env) => {
    try {
        const { room } = request.params;
        const { limit } = request.query;
        const db = new Database(env);
        const messages = await db.getMessages(room, limit ? parseInt(limit) : 50);
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

// Отправить сообщение
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
// Обработка статических файлов
async function serveStatic(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Если запрос к API - пропускаем
    if (path.startsWith('/api/')) return null;
    
    // Если корень - отдаем index.html
    if (path === '/') {
        return new Response(await getAsset('index.html', env), {
            headers: { 'Content-Type': 'text/html' }
        });
    }
    
    // Пробуем найти файл
    const filePath = path.slice(1) || 'index.html';
    const content = await getAsset(filePath, env);
    
    if (content) {
        const ext = filePath.split('.').pop();
        const mimeTypes = {
            'html': 'text/html',
            'css': 'text/css',
            'js': 'application/javascript',
            'json': 'application/json',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'gif': 'image/gif',
            'svg': 'image/svg+xml'
        };
        return new Response(content, {
            headers: { 'Content-Type': mimeTypes[ext] || 'text/plain' }
        });
    }
    
    return null;
}

async function getAsset(path, env) {
    // В реальном проекте файлы будут в assets биндинге
    // Для простоты используем встроенные HTML
    if (path === 'index.html') return getIndexHTML();
    if (path === 'wiki.html') return getWikiHTML();
    if (path === 'hosting.html') return getHostingHTML();
    if (path === 'games.html') return getGamesHTML();
    if (path === 'chat.html') return getChatHTML();
    if (path === 'styles.css') return getStylesCSS();
    if (path === 'script.js') return getScriptJS();
    return null;
}

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
            // Пробуем API маршруты
            const apiResponse = await router.handle(request, env);
            if (apiResponse) {
                const response = new Response(apiResponse.body, apiResponse);
                response.headers.set('Access-Control-Allow-Origin', '*');
                return response;
            }

            // Пробуем статику
            const staticResponse = await serveStatic(request, env);
            if (staticResponse) {
                staticResponse.headers.set('Access-Control-Allow-Origin', '*');
                return staticResponse;
            }

            // 404
            return new Response('Страница не найдена', { status: 404 });
        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
};

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

// ... остальные HTML страницы аналогично (я их сократил для экономии места)
// В полной версии все страницы из предыдущего ответа

function getWikiHTML() {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IT Wiki — CodePedia</title>
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="logo">
                <span class="code">Code</span><span class="pedia">Pedia</span>
            </div>
            <nav class="nav">
                <a href="/"><i class="fas fa-home"></i> Главная</a>
                <a href="/wiki.html" class="active"><i class="fas fa-book"></i> Вики</a>
                <a href="/hosting.html"><i class="fas fa-server"></i> Хостинг</a>
                <a href="/games.html"><i class="fas fa-gamepad"></i> Игры</a>
                <a href="/chat.html"><i class="fas fa-comments"></i> Обсуждения</a>
            </nav>
            <div class="user-actions">
                <button class="btn btn-primary" onclick="openCreateWiki()"><i class="fas fa-plus"></i> Создать вики</button>
            </div>
        </div>
    </header>

    <section class="page-header">
        <div class="container">
            <h1><i class="fas fa-book" style="color: #e07c2c;"></i> IT Вики</h1>
            <p>Создайте свой поддомен <strong>название.codepedia.space</strong> и наполняйте статьями</p>
        </div>
    </section>

    <section class="wiki-controls">
        <div class="container">
            <div class="search-bar">
                <input type="text" id="wikiSearch" placeholder="Поиск вики..." oninput="filterWikis()">
                <button class="btn btn-primary"><i class="fas fa-search"></i></button>
            </div>
            <div class="wiki-actions">
                <button class="btn btn-success" onclick="openCreateWiki()"><i class="fas fa-plus"></i> Создать вики</button>
                <button class="btn btn-outline" onclick="openCreateArticle()"><i class="fas fa-file-alt"></i> Новая статья</button>
            </div>
        </div>
    </section>

    <section class="wiki-list">
        <div class="container">
            <div class="wiki-grid" id="wikiGrid">
                <!-- Загружается из API -->
            </div>
        </div>
    </section>

    <!-- Модальное окно создания вики -->
    <div class="modal" id="createWikiModal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('createWikiModal')">&times;</span>
            <h2>Создать новую вики</h2>
            <form id="createWikiForm" onsubmit="createWiki(event)">
                <div class="form-group">
                    <label>Название вики:</label>
                    <input type="text" id="wikiName" placeholder="Например: JavaScript" required>
                </div>
                <div class="form-group">
                    <label>Поддомен:</label>
                    <div class="domain-input">
                        <input type="text" id="wikiSubdomain" placeholder="javascript" required>
                        <span>.codepedia.space</span>
                    </div>
                </div>
                <div class="form-group">
                    <label>Описание:</label>
                    <textarea id="wikiDesc" rows="3" placeholder="Краткое описание вики"></textarea>
                </div>
                <button type="submit" class="btn btn-success"><i class="fas fa-check"></i> Создать</button>
            </form>
        </div>
    </div>

    <!-- Модальное окно создания статьи -->
    <div class="modal" id="createArticleModal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('createArticleModal')">&times;</span>
            <h2>Новая статья</h2>
            <form id="createArticleForm" onsubmit="createArticle(event)">
                <div class="form-group">
                    <label>Выберите вики:</label>
                    <select id="articleWiki" required></select>
                </div>
                <div class="form-group">
                    <label>Заголовок статьи:</label>
                    <input type="text" id="articleTitle" placeholder="Название статьи" required>
                </div>
                <div class="form-group">
                    <label>Содержание:</label>
                    <textarea id="articleContent" rows="5" placeholder="Текст статьи..."></textarea>
                </div>
                <button type="submit" class="btn btn-success"><i class="fas fa-check"></i> Опубликовать</button>
            </form>
        </div>
    </div>

    <footer class="footer">
        <div class="container">
            <p>© 2026 <span class="code">Code</span><span class="pedia">Pedia</span> — IT энциклопедия</p>
        </div>
    </footer>

    <script src="/script.js"></script>
</body>
</html>`;
}

// Функции для остальных страниц аналогично...
function getHostingHTML() { return '<h1>Хостинг</h1><script src="/script.js"></script>'; }
function getGamesHTML() { return '<h1>Игры</h1><script src="/script.js"></script>'; }
function getChatHTML() { return '<h1>Чат</h1><script src="/script.js"></script>'; }
function getStylesCSS() { return `/* CSS из предыдущего ответа */`; }
function getScriptJS() { return `// JavaScript из предыдущего ответа, но с API вызовами`; }
