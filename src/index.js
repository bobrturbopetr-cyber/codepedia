import { Router } from 'itty-router';
import { Database } from './db.js';

const router = Router();

// ======== API МАРШРУТЫ ========
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
// Все HTML страницы
const PAGES = {
    '': getIndexHTML,
    'index.html': getIndexHTML,
    'wiki.html': getWikiHTML,
    'hosting.html': getHostingHTML,
    'games.html': getGamesHTML,
    'chat.html': getChatHTML
};

// ======== ОСНОВНОЙ ОБРАБОТЧИК ========
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        
        // CORS для API
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }

        // 1. API маршруты
        if (path.startsWith('/api/')) {
            const apiResponse = await router.handle(request, env);
            if (apiResponse) {
                const response = new Response(apiResponse.body, apiResponse);
                response.headers.set('Access-Control-Allow-Origin', '*');
                return response;
            }
        }

        // 2. CSS файл
        if (path === '/styles.css') {
            return new Response(getStylesCSS(), {
                headers: { 
                    'Content-Type': 'text/css',
                    'Cache-Control': 'public, max-age=3600'
                }
            });
        }

        // 3. JS файл
        if (path === '/script.js') {
            return new Response(getScriptJS(), {
                headers: { 
                    'Content-Type': 'application/javascript',
                    'Cache-Control': 'public, max-age=3600'
                }
            });
        }

        // 4. HTML страницы
        const pageName = path === '/' ? '' : path.slice(1);
        if (pageName in PAGES) {
            return new Response(PAGES[pageName](), {
                headers: { 
                    'Content-Type': 'text/html',
                    'Cache-Control': 'public, max-age=300'
                }
            });
        }

        // 5. 404
        return new Response('Страница не найдена', { 
            status: 404,
            headers: { 'Content-Type': 'text/plain' }
        });
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

function getHostingHTML() {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Хостинг — CodePedia</title>
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
                <a href="/wiki.html"><i class="fas fa-book"></i> Вики</a>
                <a href="/hosting.html" class="active"><i class="fas fa-server"></i> Хостинг</a>
                <a href="/games.html"><i class="fas fa-gamepad"></i> Игры</a>
                <a href="/chat.html"><i class="fas fa-comments"></i> Обсуждения</a>
            </nav>
            <div class="user-actions">
                <span class="user-status online"><i class="fas fa-circle"></i> Онлайн</span>
            </div>
        </div>
    </header>

    <section class="page-header">
        <div class="container">
            <h1><i class="fas fa-server" style="color: #2b6fbf;"></i> Хостинг и файловый менеджер</h1>
            <p>Управляйте своими проектами и файлами на поддоменах <strong>*.codepedia.space</strong></p>
        </div>
    </section>

    <section class="hosting-controls">
        <div class="container">
            <div class="hosting-tabs">
                <button class="tab-btn active" onclick="switchTab('projects')"><i class="fas fa-folder"></i> Проекты</button>
                <button class="tab-btn" onclick="switchTab('files')"><i class="fas fa-file"></i> Файлы</button>
                <button class="tab-btn" onclick="switchTab('domains')"><i class="fas fa-globe"></i> Домены</button>
            </div>
            <div class="hosting-actions">
                <button class="btn btn-success" onclick="openCreateProject()"><i class="fas fa-plus"></i> Создать проект</button>
                <button class="btn btn-primary" onclick="document.getElementById('fileUpload').click()"><i class="fas fa-upload"></i> Загрузить файл</button>
                <input type="file" id="fileUpload" style="display:none" multiple onchange="uploadFiles(event)">
            </div>
        </div>
    </section>

    <!-- Вкладка: Проекты -->
    <section class="hosting-content" id="projectsTab">
        <div class="container">
            <div class="projects-grid" id="projectsGrid">
                <!-- Загружается из API -->
            </div>
        </div>
    </section>

    <!-- Вкладка: Файлы -->
    <section class="hosting-content" id="filesTab" style="display:none;">
        <div class="container">
            <div class="file-manager">
                <div class="file-path">
                    <i class="fas fa-folder-open"></i>
                    <span id="currentPath">/</span>
                </div>
                <div class="file-list" id="fileList">
                    <!-- Загружается из API -->
                </div>
            </div>
        </div>
    </section>

    <!-- Вкладка: Домены -->
    <section class="hosting-content" id="domainsTab" style="display:none;">
        <div class="container">
            <div class="domains-list" id="domainsList">
                <div class="domain-item">
                    <i class="fas fa-check-circle" style="color: #00b894;"></i>
                    <span><strong>мойпроект.codepedia.space</strong> — Активен</span>
                    <button class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                </div>
                <div class="domain-item">
                    <i class="fas fa-clock" style="color: #fdcb6e;"></i>
                    <span><strong>тест.codepedia.space</strong> — Ожидает настройки</span>
                    <button class="btn btn-primary btn-sm"><i class="fas fa-sync"></i> Настроить</button>
                </div>
            </div>
            <div class="domain-add">
                <input type="text" id="newDomain" placeholder="subdomain">
                <span>.codepedia.space</span>
                <button class="btn btn-success" onclick="addDomain()"><i class="fas fa-plus"></i> Добавить</button>
            </div>
        </div>
    </section>

    <!-- Модальное окно создания проекта -->
    <div class="modal" id="createProjectModal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('createProjectModal')">&times;</span>
            <h2><i class="fas fa-folder-plus" style="color:#2b6fbf;"></i> Создать проект</h2>
            <form onsubmit="createProject(event)">
                <div class="form-group">
                    <label>Название проекта:</label>
                    <input type="text" id="projectName" placeholder="Мой проект" required>
                </div>
                <div class="form-group">
                    <label>Поддомен:</label>
                    <div class="domain-input">
                        <input type="text" id="projectSubdomain" placeholder="мойпроект" required pattern="[a-z0-9-]+">
                        <span>.codepedia.space</span>
                    </div>
                    <small style="color:#636e72;">Только латиница, цифры и дефис</small>
                </div>
                <div class="form-group">
                    <label>Описание:</label>
                    <textarea id="projectDesc" rows="3" placeholder="Описание проекта"></textarea>
                </div>
                <button type="submit" class="btn btn-success"><i class="fas fa-check"></i> Создать</button>
            </form>
        </div>
    </div>

    <footer class="footer">
        <div class="container">
            <p>© 2026 <span class="code">Code</span><span class="pedia">Pedia</span> — Хостинг</p>
            <p><small>Все проекты доступны по поддоменам .codepedia.space</small></p>
        </div>
    </footer>

    <script src="/script.js"></script>
</body>
</html>`;
}

function getGamesHTML() {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Игровая платформа — CodePedia</title>
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
                <a href="/wiki.html"><i class="fas fa-book"></i> Вики</a>
                <a href="/hosting.html"><i class="fas fa-server"></i> Хостинг</a>
                <a href="/games.html" class="active"><i class="fas fa-gamepad"></i> Игры</a>
                <a href="/chat.html"><i class="fas fa-comments"></i> Обсуждения</a>
            </nav>
            <div class="user-actions">
                <button class="btn btn-primary" onclick="openUploadGame()"><i class="fas fa-upload"></i> Загрузить игру</button>
            </div>
        </div>
    </header>

    <section class="page-header">
        <div class="container">
            <h1><i class="fas fa-gamepad" style="color: #00b894;"></i> Игровая платформа</h1>
            <p>Скачивайте игры или загружайте свои собственные</p>
        </div>
    </section>

    <section class="games-controls">
        <div class="container">
            <div class="search-bar">
                <input type="text" id="gameSearch" placeholder="Поиск игр..." oninput="filterGames()">
                <button class="btn btn-primary"><i class="fas fa-search"></i></button>
            </div>
            <div class="game-filters">
                <button class="filter-btn active" onclick="filterGamesBy('all')">Все</button>
                <button class="filter-btn" onclick="filterGamesBy('action')">Экшен</button>
                <button class="filter-btn" onclick="filterGamesBy('strategy')">Стратегии</button>
                <button class="filter-btn" onclick="filterGamesBy('rpg')">RPG</button>
                <button class="filter-btn" onclick="filterGamesBy('indie')">Инди</button>
                <button class="filter-btn" onclick="filterGamesBy('other')">Другое</button>
            </div>
        </div>
    </section>

    <section class="games-grid-section">
        <div class="container">
            <div class="games-grid" id="gamesGrid">
                <!-- Загружается из API -->
            </div>
        </div>
    </section>

    <!-- Модальное окно загрузки игры -->
    <div class="modal" id="uploadGameModal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('uploadGameModal')">&times;</span>
            <h2><i class="fas fa-upload" style="color:#00b894;"></i> Загрузить игру</h2>
            <form onsubmit="uploadGame(event)">
                <div class="form-group">
                    <label>Название игры:</label>
                    <input type="text" id="gameName" placeholder="Название игры" required>
                </div>
                <div class="form-group">
                    <label>Жанр:</label>
                    <select id="gameGenre">
                        <option value="action">Экшен</option>
                        <option value="strategy">Стратегия</option>
                        <option value="rpg">RPG</option>
                        <option value="indie">Инди</option>
                        <option value="other">Другое</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Описание:</label>
                    <textarea id="gameDesc" rows="3" placeholder="Краткое описание игры"></textarea>
                </div>
                <div class="form-group">
                    <label>Ссылка на скачивание:</label>
                    <input type="url" id="gameUrl" placeholder="https://example.com/game.zip" required>
                </div>
                <div class="form-group">
                    <label>Изображение (эмодзи или URL):</label>
                    <input type="text" id="gameImage" placeholder="🎮 или https://..." value="🎮">
                </div>
                <button type="submit" class="btn btn-success"><i class="fas fa-check"></i> Загрузить</button>
            </form>
        </div>
    </div>

    <footer class="footer">
        <div class="container">
            <p>© 2026 <span class="code">Code</span><span class="pedia">Pedia</span> — Игровая платформа</p>
            <p><small>Загружайте свои игры и делитесь с сообществом</small></p>
        </div>
    </footer>

    <script src="/script.js"></script>
</body>
</html>`;
}

function getChatHTML() {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Обсуждения — CodePedia</title>
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
                <a href="/wiki.html"><i class="fas fa-book"></i> Вики</a>
                <a href="/hosting.html"><i class="fas fa-server"></i> Хостинг</a>
                <a href="/games.html"><i class="fas fa-gamepad"></i> Игры</a>
                <a href="/chat.html" class="active"><i class="fas fa-comments"></i> Обсуждения</a>
            </nav>
            <div class="user-actions">
                <span class="user-status online"><i class="fas fa-circle"></i> Онлайн</span>
            </div>
        </div>
    </header>

    <section class="page-header">
        <div class="container">
            <h1><i class="fas fa-comments" style="color: #6c5ce7;"></i> Обсуждения и чаты</h1>
            <p>Личные сообщения и групповые обсуждения с участниками</p>
        </div>
    </section>

    <section class="chat-layout">
        <div class="container">
            <div class="chat-sidebar">
                <div class="chat-search">
                    <input type="text" placeholder="Поиск чатов..." id="chatSearch" oninput="filterChats()">
                </div>
                <div class="chat-list" id="chatList">
                    <div class="chat-item active" onclick="openChat('general')">
                        <div class="chat-avatar"><i class="fas fa-users"></i></div>
                        <div class="chat-info">
                            <span class="chat-name"># Общий чат</span>
                            <span class="chat-preview">Добро пожаловать!</span>
                        </div>
                        <span class="chat-time">Сейчас</span>
                    </div>
                    <div class="chat-item" onclick="openChat('project1')">
                        <div class="chat-avatar"><i class="fas fa-folder"></i></div>
                        <div class="chat-info">
                            <span class="chat-name">Проект: WebDev</span>
                            <span class="chat-preview">Кто может помочь?</span>
                        </div>
                        <span class="chat-time">11:20</span>
                    </div>
                    <div class="chat-item" onclick="openChat('private')">
                        <div class="chat-avatar"><i class="fas fa-user"></i></div>
                        <div class="chat-info">
                            <span class="chat-name">Алексей Петров</span>
                            <span class="chat-preview">Спасибо за помощь!</span>
                        </div>
                        <span class="chat-time">10:05</span>
                    </div>
                    <div class="chat-item" onclick="openChat('gaming')">
                        <div class="chat-avatar"><i class="fas fa-gamepad"></i></div>
                        <div class="chat-info">
                            <span class="chat-name">Игровой чат</span>
                            <span class="chat-preview">Кто в доту?</span>
                        </div>
                        <span class="chat-time">09:15</span>
                    </div>
                </div>
                <button class="btn btn-primary" style="width:100%;margin-top:10px;" onclick="createGroupChat()">
                    <i class="fas fa-plus"></i> Создать групповой чат
                </button>
            </div>

            <div class="chat-main" id="chatMain">
                <div class="chat-header">
                    <h3 id="currentChatName"># Общий чат</h3>
                    <div class="chat-header-actions">
                        <button class="btn btn-sm btn-outline"><i class="fas fa-user-plus"></i> Пригласить</button>
                        <button class="btn btn-sm btn-outline"><i class="fas fa-ellipsis-v"></i></button>
                    </div>
                </div>
                <div class="chat-messages" id="chatMessages">
                    <!-- Загружается из API -->
                </div>
                <div class="chat-input">
                    <input type="text" id="messageInput" placeholder="Введите сообщение..." onkeypress="sendMessage(event)">
                    <button class="btn btn-primary" onclick="sendMessage()"><i class="fas fa-paper-plane"></i></button>
                    <button class="btn btn-outline"><i class="fas fa-smile"></i></button>
                    <button class="btn btn-outline"><i class="fas fa-paperclip"></i></button>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>© 2026 <span class="code">Code</span><span class="pedia">Pedia</span> — Обсуждения</p>
            <p><small>Общайтесь с сообществом в реальном времени</small></p>
        </div>
    </footer>

    <script src="/script.js"></script>
</body>
</html>`;
}

// ======== CSS ========
function getStylesCSS() {
    return `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#f5f6fa;color:#2d3436;min-height:100vh;display:flex;flex-direction:column}
.container{max-width:1200px;margin:0 auto;padding:0 20px;width:100%}
.header{background:#ffffff;box-shadow:0 2px 10px rgba(0,0,0,0.08);padding:12px 0;position:sticky;top:0;z-index:100}
.header .container{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:15px}
.logo{font-size:28px;font-weight:700;letter-spacing:-0.5px}
.code{color:#e07c2c}
.pedia{color:#2b6fbf}
.logo-dot{color:#6c5ce7}
.nav{display:flex;gap:20px;flex-wrap:wrap}
.nav a{color:#636e72;text-decoration:none;font-weight:500;padding:6px 12px;border-radius:8px;transition:all 0.2s;font-size:15px}
.nav a i{margin-right:6px}
.nav a:hover{background:#f0f0f0;color:#2d3436}
.nav a.active{background:#2b6fbf;color:white}
.user-actions{display:flex;gap:10px;align-items:center}
.user-status{display:flex;align-items:center;gap:6px;font-size:14px;font-weight:500}
.user-status.online{color:#00b894}
.user-status i{font-size:10px}
.btn{padding:8px 18px;border:none;border-radius:8px;font-weight:600;font-size:14px;cursor:pointer;transition:all 0.2s;display:inline-flex;align-items:center;gap:6px;text-decoration:none}
.btn-primary{background:#2b6fbf;color:white}
.btn-primary:hover{background:#1e5a9e;transform:translateY(-1px)}
.btn-success{background:#00b894;color:white}
.btn-success:hover{background:#00987a;transform:translateY(-1px)}
.btn-outline{background:transparent;color:#2d3436;border:2px solid #dfe6e9}
.btn-outline:hover{border-color:#2b6fbf;color:#2b6fbf}
.btn-danger{background:#e17055;color:white}
.btn-danger:hover{background:#c0392b}
.btn-sm{padding:4px 12px;font-size:12px}
.hero{background:linear-gradient(135deg,#e07c2c15,#2b6fbf15);padding:60px 0;text-align:center}
.hero h1{font-size:42px;margin-bottom:16px}
.hero p{font-size:18px;color:#636e72;max-width:600px;margin:0 auto 30px}
.hero-stats{display:flex;justify-content:center;gap:50px;flex-wrap:wrap}
.stat{text-align:center}
.stat .number{font-size:32px;font-weight:700;color:#2b6fbf;display:block}
.stat .label{color:#636e72;font-size:14px}
.features{padding:50px 0}
.features h2{text-align:center;font-size:30px;margin-bottom:30px}
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:25px}
.feature-card{background:white;padding:30px 25px;border-radius:16px;box-shadow:0 4px 12px rgba(0,0,0,0.06);text-align:center;transition:all 0.3s;border:1px solid #ecf0f1}
.feature-card:hover{transform:translateY(-5px);box-shadow:0 8px 25px rgba(0,0,0,0.1)}
.feature-card i{font-size:40px;margin-bottom:15px}
.feature-card h3{font-size:20px;margin-bottom:10px}
.feature-card p{color:#636e72;margin-bottom:15px;font-size:14px;line-height:1.6}
.page-header{padding:30px 0;background:white;border-bottom:1px solid #ecf0f1}
.page-header h1{font-size:28px}
.page-header p{color:#636e72;margin-top:5px}
.wiki-controls{padding:20px 0;background:white;border-bottom:1px solid #ecf0f1}
.wiki-controls .container{display:flex;gap:20px;flex-wrap:wrap;justify-content:space-between;align-items:center}
.search-bar{display:flex;gap:10px;flex:1;min-width:200px}
.search-bar input{flex:1;padding:10px 16px;border:2px solid #dfe6e9;border-radius:10px;font-size:14px;outline:none}
.search-bar input:focus{border-color:#2b6fbf}
.wiki-actions{display:flex;gap:10px;flex-wrap:wrap}
.wiki-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;padding:30px 0}
.wiki-card{background:white;border-radius:12px;padding:20px;border:1px solid #ecf0f1;transition:all 0.2s}
.wiki-card:hover{border-color:#2b6fbf;box-shadow:0 4px 12px rgba(43,111,191,0.1)}
.wiki-card h3{color:#2b6fbf;font-size:18px}
.wiki-card .subdomain{color:#636e72;font-size:13px}
.wiki-card .desc{margin:10px 0;color:#636e72;font-size:14px}
.hosting-controls{padding:20px 0;background:white;border-bottom:1px solid #ecf0f1}
.hosting-controls .container{display:flex;gap:20px;flex-wrap:wrap;justify-content:space-between;align-items:center}
.hosting-tabs{display:flex;gap:5px}
.tab-btn{padding:8px 18px;border:none;background:transparent;font-weight:600;color:#636e72;border-radius:8px;cursor:pointer;transition:all 0.2s}
.tab-btn.active{background:#2b6fbf;color:white}
.tab-btn:hover:not(.active){background:#f0f0f0}
.hosting-actions{display:flex;gap:10px;flex-wrap:wrap}
.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px;padding:30px 0}
.project-card{background:white;border-radius:12px;padding:20px;border:1px solid #ecf0f1}
.project-card h3{color:#2b6fbf}
.project-card .domain{font-size:13px;color:#636e72}
.project-card .actions{margin-top:15px;display:flex;gap:8px;flex-wrap:wrap}
.file-manager{background:white;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #ecf0f1}
.file-path{padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:15px;font-family:monospace}
.file-list{display:grid;gap:8px}
.file-item{display:flex;justify-content:space-between;padding:10px 15px;background:#f8f9fa;border-radius:8px;align-items:center}
.file-item .file-name{display:flex;align-items:center;gap:10px}
.file-item .file-size{color:#636e72;font-size:13px}
.file-item .file-actions{display:flex;gap:8px}
.domain-item{display:flex;align-items:center;gap:15px;padding:15px;background:white;border-radius:10px;margin-bottom:10px;border:1px solid #ecf0f1}
.domain-add{display:flex;align-items:center;gap:10px;padding:20px;background:#f8f9fa;border-radius:12px;margin-top:20px;flex-wrap:wrap}
.domain-add input{padding:10px 14px;border:2px solid #dfe6e9;border-radius:8px;font-size:14px;flex:1;min-width:150px}
.games-controls{padding:20px 0;background:white;border-bottom:1px solid #ecf0f1}
.games-controls .container{display:flex;gap:20px;flex-wrap:wrap;align-items:center;justify-content:space-between}
.game-filters{display:flex;gap:8px;flex-wrap:wrap}
.filter-btn{padding:6px 16px;border:2px solid #dfe6e9;background:transparent;border-radius:20px;font-weight:500;cursor:pointer;transition:all 0.2s}
.filter-btn.active,.filter-btn:hover{background:#2b6fbf;color:white;border-color:#2b6fbf}
.games-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:25px;padding:30px 0}
.game-card{background:white;border-radius:12px;overflow:hidden;border:1px solid #ecf0f1;transition:all 0.3s}
.game-card:hover{transform:translateY(-4px);box-shadow:0 8px 25px rgba(0,0,0,0.1)}
.game-card .game-image{height:140px;background:linear-gradient(135deg,#2b6fbf,#e07c2c);display:flex;align-items:center;justify-content:center;font-size:48px;color:white}
.game-card .game-info{padding:15px}
.game-card .game-info h3{font-size:16px;margin-bottom:4px}
.game-card .game-genre{font-size:12px;background:#f0f0f0;padding:2px 12px;border-radius:12px;display:inline-block}
.game-card .game-desc{font-size:13px;color:#636e72;margin:8px 0}
.game-card .game-actions{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
.chat-layout .container{display:grid;grid-template-columns:300px 1fr;gap:20px;padding:20px 0;min-height:500px}
.chat-sidebar{background:white;border-radius:12px;border:1px solid #ecf0f1;padding:15px}
.chat-search input{width:100%;padding:10px 14px;border:2px solid #dfe6e9;border-radius:10px;margin-bottom:15px;font-size:14px}
.chat-list{display:flex;flex-direction:column;gap:5px;max-height:400px;overflow-y:auto}
.chat-item{display:grid;grid-template-columns:40px 1fr auto;gap:10px;padding:12px;border-radius:10px;cursor:pointer;transition:all 0.2s;align-items:center}
.chat-item:hover,.chat-item.active{background:#f0f4ff}
.chat-avatar{width:40px;height:40px;background:#dfe6e9;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#636e72}
.chat-info{overflow:hidden}
.chat-name{font-weight:600;font-size:14px}
.chat-preview{font-size:13px;color:#636e72;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chat-time{font-size:11px;color:#b2bec3}
.chat-main{background:white;border-radius:12px;border:1px solid #ecf0f1;display:flex;flex-direction:column;height:500px}
.chat-header{padding:15px 20px;border-bottom:1px solid #ecf0f1;display:flex;justify-content:space-between;align-items:center}
.chat-messages{flex:1;padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:12px}
.message{display:flex;gap:12px;max-width:70%}
.message.sent{align-self:flex-end;flex-direction:row-reverse}
.message-avatar{width:36px;height:36px;background:#dfe6e9;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.message-content{background:#f0f4ff;padding:12px 16px;border-radius:12px}
.message.sent .message-content{background:#2b6fbf;color:white}
.message-header{display:flex;gap:10px;font-size:12px;margin-bottom:4px}
.message-author{font-weight:600}
.message-time{color:#b2bec3}
.message.sent .message-time{color:rgba(255,255,255,0.7)}
.message-content p{margin:0}
.chat-input{padding:15px 20px;border-top:1px solid #ecf0f1;display:flex;gap:10px;align-items:center}
.chat-input input{flex:1;padding:10px 16px;border:2px solid #dfe6e9;border-radius:10px;font-size:14px;outline:none}
.chat-input input:focus{border-color:#2b6fbf}
.modal{display:none;position:fixed;z-index:1000;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.5);justify-content:center;align-items:center;backdrop-filter:blur(4px)}
.modal.active{display:flex}
.modal-content{background:white;padding:30px;border-radius:16px;max-width:500px;width:90%;max-height:90vh;overflow-y:auto;position:relative;animation:slideIn 0.3s ease}
@keyframes slideIn{from{opacity:0;transform:translateY(-30px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
.close{position:absolute;right:20px;top:15px;font-size:28px;font-weight:300;cursor:pointer;color:#b2bec3;transition:0.2s}
.close:hover{color:#2d3436}
.form-group{margin-bottom:18px}
.form-group label{display:block;font-weight:600;margin-bottom:5px;font-size:14px}
.form-group input,.form-group select,.form-group textarea{width:100%;padding:10px 14px;border:2px solid #dfe6e9;border-radius:10px;font-size:14px;font-family:inherit;transition:0.2s}
.form-group input:focus,.form-group textarea:focus{border-color:#2b6fbf;outline:none;box-shadow:0 0 0 3px rgba(43,111,191,0.1)}
.form-group textarea{resize:vertical;min-height:80px}
.domain-input{display:flex;align-items:center;gap:8px}
.domain-input input{flex:1}
.domain-input span{color:#636e72;font-size:14px}
.footer{background:#2d3436;color:#dfe6e9;padding:20px 0;margin-top:auto;text-align:center}
.footer .code{color:#e07c2c}
.footer .pedia{color:#74b9ff}
@media (max-width:768px){.chat-layout .container{grid-template-columns:1fr}
.chat-sidebar{max-height:300px}
.hero h1{font-size:28px}
.hero-stats{gap:20px}
.header .container{flex-direction:column;align-items:stretch}
.nav{justify-content:center}
.features-grid{grid-template-columns:1fr}}
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:#f0f0f0;border-radius:10px}
::-webkit-scrollbar-thumb{background:#b2bec3;border-radius:10px}
::-webkit-scrollbar-thumb:hover{background:#636e72}`;
}

// ======== JAVASCRIPT ========
function getScriptJS() {
    return `const API_URL='';
async function loadWikis(){try{const r=await fetch('/api/wikis');const w=await r.json();const g=document.getElementById('wikiGrid');if(!g)return;g.innerHTML=w.map(w=>\`<div class="wiki-card"><h3><i class="fas fa-book" style="color:#e07c2c;"></i> \${w.name}</h3><div class="subdomain">📌 \${w.subdomain}.codepedia.space</div><div class="desc">\${w.description||'Нет описания'}</div><div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;"><button class="btn btn-sm btn-primary" onclick="viewWiki(\${w.id})"><i class="fas fa-eye"></i></button><button class="btn btn-sm btn-danger" onclick="deleteWiki(\${w.id})"><i class="fas fa-trash"></i></button></div></div>\`).join('')}catch(e){console.error(e)}}
async function createWiki(e){e.preventDefault();const name=document.getElementById('wikiName').value;const subdomain=document.getElementById('wikiSubdomain').value;const description=document.getElementById('wikiDesc').value;try{const r=await fetch('/api/wikis',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,subdomain,description})});const d=await r.json();if(r.ok){alert(\`✅ Вики создана! Доступна по адресу: \${d.url}\`);closeModal('createWikiModal');loadWikis()}else{alert(\`❌ Ошибка: \${d.error}\`)}}catch(e){alert('❌ Ошибка создания вики')}}
async function deleteWiki(id){if(!confirm('Удалить эту вики?'))return;try{const r=await fetch(\`/api/wikis/\${id}\`,{method:'DELETE'});if(r.ok)loadWikis()}catch(e){alert('Ошибка удаления')}}
async function viewWiki(id){try{const r=await fetch(\`/api/wikis/\${id}/articles\`);const a=await r.json();if(a.length===0){alert('📖 В этой вики пока нет статей')}else{alert('📖 Статьи:\\n'+a.map(a=>\`- \${a.title}\`).join('\\n'))}}catch(e){alert('Ошибка загрузки статей')}}
async function createArticle(e){e.preventDefault();const wikiId=document.getElementById('articleWiki').value;const title=document.getElementById('articleTitle').value;const content=document.getElementById('articleContent').value;try{const r=await fetch('/api/articles',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,content,wikiId:parseInt(wikiId)})});if(r.ok){alert('✅ Статья создана!');closeModal('createArticleModal');loadWikis()}}catch(e){alert('Ошибка создания статьи')}}
async function loadProjects(){try{const r=await fetch('/api/projects');const p=await r.json();const g=document.getElementById('projectsGrid');if(!g)return;g.innerHTML=p.map(p=>\`<div class="project-card"><h3><i class="fas fa-folder" style="color:#2b6fbf;"></i> \${p.name}</h3><div class="domain">🌐 \${p.subdomain}.codepedia.space</div><div class="desc" style="font-size:13px;color:#636e72;margin:8px 0;">\${p.description||'Нет описания'}</div><div class="actions"><button class="btn btn-sm btn-danger" onclick="deleteProject(\${p.id})"><i class="fas fa-trash"></i></button></div></div>\`).join('')}catch(e){console.error(e)}}
async function createProject(e){e.preventDefault();const name=document.getElementById('projectName').value;const subdomain=document.getElementById('projectSubdomain').value;const description=document.getElementById('projectDesc').value;try{const r=await fetch('/api/projects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,subdomain,description})});const d=await r.json();if(r.ok){alert(\`✅ Проект создан! Доступен по адресу: \${d.url}\`);closeModal('createProjectModal');loadProjects()}}catch(e){alert('Ошибка создания проекта')}}
async function deleteProject(id){if(!confirm('Удалить проект?'))return;try{await fetch(\`/api/projects/\${id}\`,{method:'DELETE'});loadProjects()}catch(e){alert('Ошибка удаления')}}
async function loadGames(){try{const r=await fetch('/api/games');const g=await r.json();const grid=document.getElementById('gamesGrid');if(!grid)return;grid.innerHTML=g.map(g=>\`<div class="game-card"><div class="game-image" style="background:linear-gradient(135deg,#2b6fbf,#e07c2c);font-size:48px;display:flex;align-items:center;justify-content:center;height:140px;">\${g.image||'🎮'}</div><div class="game-info"><h3>\${g.name}</h3><span class="game-genre">\${g.genre}</span><div class="game-desc">\${g.description||'Нет описания'}</div><div style="font-size:12px;color:#636e72;">⬇️ \${g.downloads||0} скачиваний</div><div class="game-actions"><a href="\${g.url}" target="_blank" class="btn btn-sm btn-success" onclick="downloadGame(\${g.id})"><i class="fas fa-download"></i> Скачать</a><button class="btn btn-sm btn-danger" onclick="deleteGame(\${g.id})"><i class="fas fa-trash"></i></button></div></div></div>\`).join('')}catch(e){console.error(e)}}
async function uploadGame(e){e.preventDefault();const name=document.getElementById('gameName').value;const genre=document.getElementById('gameGenre').value;const description=document.getElementById('gameDesc').value;const url=document.getElementById('gameUrl').value;const image=document.getElementById('gameImage').value||'🎮';try{const r=await fetch('/api/games',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,genre,description,url,image})});if(r.ok){alert('✅ Игра загружена!');closeModal('uploadGameModal');loadGames()}}catch(e){alert('Ошибка загрузки игры')}}
async function deleteGame(id){if(!confirm('Удалить игру?'))return;try{await fetch(\`/api/games/\${id}\`,{method:'DELETE'});loadGames()}catch(e){alert('Ошибка удаления')}}
async function downloadGame(id){try{await fetch(\`/api/games/\${id}/download\`,{method:'POST'})}catch(e){}}
async function loadMessages(room='general'){try{const r=await fetch(\`/api/chat/\${room}\`);const m=await r.json();const c=document.getElementById('chatMessages');if(!c)return;c.innerHTML=m.map(m=>\`<div class="message \${m.author==='Вы'?'sent':'received'}"><div class="message-avatar"><i class="fas fa-user"></i></div><div class="message-content"><div class="message-header"><span class="message-author">\${m.author}</span><span class="message-time">\${new Date(m.timestamp).toLocaleTimeString()}</span></div><p>\${m.text}</p></div></div>\`).join('');c.scrollTop=c.scrollHeight}catch(e){console.error(e)}}
async function sendMessage(e){if(e&&e.key!=='Enter')return;const input=document.getElementById('messageInput');const text=input.value.trim();if(!text)return;try{await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({room:'general',author:'Пользователь',text})});input.value='';loadMessages()}catch(e){alert('Ошибка отправки сообщения')}}
function closeModal(id){document.getElementById(id).classList.remove('active')}
function openCreateWiki(){document.getElementById('createWikiModal').classList.add('active')}
function openCreateArticle(){fetch('/api/wikis').then(r=>r.json()).then(w=>{const s=document.getElementById('articleWiki');s.innerHTML=w.map(w=>\`<option value="\${w.id}">\${w.name}</option>\`).join('');document.getElementById('createArticleModal').classList.add('active')})}
function openCreateProject(){document.getElementById('createProjectModal').classList.add('active')}
function openUploadGame(){document.getElementById('uploadGameModal').classList.add('active')}
function filterWikis(){const s=document.getElementById('wikiSearch')?.value.toLowerCase()||'';document.querySelectorAll('.wiki-card').forEach(c=>{c.style.display=c.textContent.toLowerCase().includes(s)?'block':'none'})}
function filterGames(){const s=document.getElementById('gameSearch')?.value.toLowerCase()||'';document.querySelectorAll('.game-card').forEach(c=>{c.style.display=c.textContent.toLowerCase().includes(s)?'block':'none'})}
function filterGamesBy(genre){document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));document.querySelector(\`.filter-btn[onclick*="\${genre}"]\`)?.classList.add('active');const games=document.querySelectorAll('.game-card');games.forEach(c=>{if(genre==='all'||c.textContent.toLowerCase().includes(genre)){c.style.display='block'}else{c.style.display='none'}})}
function switchTab(tab){document.querySelectorAll('.hosting-content').forEach(el=>el.style.display='none');document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));document.getElementById(tab+'Tab').style.display='block';document.querySelector(\`.tab-btn[onclick*="\${tab}"]\`).classList.add('active');if(tab==='files'){document.getElementById('fileList').innerHTML='<div class="file-item"><div class="file-name"><i class="fas fa-file"></i><span>Нет файлов</span></div></div>'}}
function openChat(name){document.getElementById('currentChatName').textContent='# '+name;loadMessages(name)}
function createGroupChat(){const name=prompt('Название группового чата:');if(name)alert(\`✅ Чат "\${name}" создан!\`)}
function uploadFiles(e){const files=e.target.files;if(files.length>0){alert(\`✅ Загружено \${files.length} файлов\`)}}
function addDomain(){const input=document.getElementById('newDomain');if(input.value){alert(\`✅ Домен \${input.value}.codepedia.space добавлен\`);input.value=''}}
async function loadStats(){try{const[w,r,g]=await Promise.all([fetch('/api/wikis'),fetch('/api/projects'),fetch('/api/games')]);const wikis=await w.json();const projects=await r.json();const games=await g.json();document.getElementById('wikiCount').textContent=wikis.length;document.getElementById('projectCount').textContent=projects.length;document.getElementById('gameCount').textContent=games.length}catch(e){}}
document.addEventListener('DOMContentLoaded',()=>{const path=window.location.pathname;if(path==='/'||path==='/index.html')loadStats();if(path.includes('wiki.html'))loadWikis();if(path.includes('hosting.html'))loadProjects();if(path.includes('games.html'))loadGames();if(path.includes('chat.html'))loadMessages();document.querySelectorAll('.modal').forEach(modal=>{modal.addEventListener('click',function(e){if(e.target===this)this.classList.remove('active')})})});`;
}
