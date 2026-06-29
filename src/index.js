import { Router } from 'itty-router';
import { Database } from './db.js';

const router = Router();

// ======== ВСЕ API МАРШРУТЫ ========

// ---- ВИКИ ----
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

// ---- ПРОЕКТЫ ----
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

// ---- ИГРЫ ----
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

// Загрузить игру
router.post('/api/games', async (request, env) => {
    try {
        const { name, genre, description, url, image, uploadedBy } = await request.json();
        const db = new Database(env);
        const game = await db.createGame(name, genre, description, url, image, uploadedBy || 'user');
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

// ---- ЧАТ ----
// Получить сообщения комнаты
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

// ======== ОБРАБОТЧИК СТАТИКИ ========
async function handleStatic(request, env) {
    const url = new URL(request.url);
    
    // Если это API - пропускаем
    if (url.pathname.startsWith('/api/')) {
        return null;
    }

    try {
        // Пробуем получить файл из assets
        const response = await env.ASSETS.fetch(request);
        
        // Если файл найден - возвращаем
        if (response.status !== 404) {
            return response;
        }

        // Если файл не найден и это не index.html - пробуем index.html
        if (!url.pathname.includes('.')) {
            const indexResponse = await env.ASSETS.fetch(
                new Request('https://' + url.host + '/index.html', request)
            );
            if (indexResponse.status !== 404) {
                return indexResponse;
            }
        }

        return null;
    } catch (e) {
        return null;
    }
}

// ======== ОСНОВНОЙ ОБРАБОТЧИК ========
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        
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
        if (url.pathname.startsWith('/api/')) {
            const apiResponse = await router.handle(request, env);
            if (apiResponse) {
                const response = new Response(apiResponse.body, apiResponse);
                response.headers.set('Access-Control-Allow-Origin', '*');
                return response;
            }
        }

        // 2. Статика из папки public
        const staticResponse = await handleStatic(request, env);
        if (staticResponse) {
            // Добавляем кэширование для статики
            if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico)$/)) {
                staticResponse.headers.set('Cache-Control', 'public, max-age=86400');
            }
            staticResponse.headers.set('Access-Control-Allow-Origin', '*');
            return staticResponse;
        }

        // 3. 404
        return new Response('Страница не найдена', { 
            status: 404,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
};
