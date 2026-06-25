// ========== HTML-СТРАНИЦЫ ==========

const MAIN_PAGE = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Codepedia — Экосистема для разработчиков</title>
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
        .hero h1{font-size:52px;margin-bottom:16px;background:linear-gradient(135deg,#ff6b00,#4a90e2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .hero p{font-size:20px;color:#a0a0a0;max-width:700px;margin:0 auto}
        .hero .sub{font-size:16px;color:#666;margin-top:10px}
        .stats{display:flex;gap:50px;justify-content:center;margin:30px 0;flex-wrap:wrap}
        .stat{text-align:center}
        .stat-number{font-size:36px;font-weight:700;color:#ff6b00}
        .stat-label{font-size:14px;color:#a0a0a0}
        .features-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:25px;margin:40px 0}
        .feature-card{background:rgba(255,255,255,0.05);border-radius:16px;padding:30px;text-align:center;border:1px solid rgba(255,255,255,0.1);transition:transform 0.3s;cursor:pointer}
        .feature-card:hover{transform:translateY(-6px);border-color:#ff6b00}
        .feature-card .icon{font-size:48px;margin-bottom:15px}
        .feature-card h3{color:#ff6b00;margin-bottom:10px;font-size:20px}
        .feature-card p{color:#a0a0a0;font-size:14px;line-height:1.6}
        .feature-card .tag{display:inline-block;background:rgba(255,107,0,0.2);color:#ff6b00;padding:4px 12px;border-radius:20px;font-size:12px;margin-top:10px}
        .btn{display:inline-block;background:#ff6b00;color:#fff;padding:12px 32px;border-radius:40px;text-decoration:none;font-weight:600;margin-top:12px;transition:background 0.2s}
        .btn:hover{background:#ff8533}
        .btn-secondary{background:transparent;border:1px solid #4a90e2;color:#4a90e2}
        .btn-secondary:hover{background:#4a90e2;color:#fff}
        .footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;color:#666;font-size:13px}
        .footer a{color:#ff6b00;text-decoration:none}
        .footer a:hover{text-decoration:underline}
        .quote{background:rgba(255,107,0,0.05);border-radius:20px;padding:30px;margin:30px 0;text-align:center;border:1px solid rgba(255,107,0,0.2)}
        .quote p{font-size:20px;font-style:italic;color:#e0e0e0}
        .quote .author{color:#ff6b00;font-style:normal;font-weight:600}
        @media (max-width:768px){.hero h1{font-size:32px}.nav-links{margin-top:10px}.stats{gap:20px}}
    </style>
</head>
<body>
<div class="header">
<div class="logo"><h1><span class="code-orange">Code</span><span class="pedia">pedia</span></h1></div>
<div class="nav-links">
<a href="https://wiki.codepedia.space">📖 Wiki</a>
<a href="https://courses.codepedia.space">🎓 Курсы</a>
<a href="https://hosting.codepedia.space">🚀 Хостинг</a>
<a href="https://games.codepedia.space">🎮 Игры</a>
<a href="https://devkit.codepedia.space">⚡ DevKit</a>
</div>
</div>
<div class="container">
<div class="hero">
<h1>🚀 Codepedia</h1>
<p>Экосистема для разработчиков всех направлений</p>
<div class="sub">Мы ценим каждого разработчика — от бэкенд-инженеров до создателей игр и frontend-мастеров</div>
<div style="margin-top:20px;">
<a href="https://wiki.codepedia.space" class="btn">📖 Начать изучение</a>
<a href="https://games.codepedia.space" class="btn btn-secondary" style="margin-left:15px;">🎮 Игровая площадка</a>
</div>
</div>

<div class="stats">
<div class="stat"><div class="stat-number" id="statArticles">0</div><div class="stat-label">статей</div></div>
<div class="stat"><div class="stat-number" id="statCourses">0</div><div class="stat-label">курсов</div></div>
<div class="stat"><div class="stat-number" id="statProjects">0</div><div class="stat-label">проектов</div></div>
<div class="stat"><div class="stat-number" id="statGames">0</div><div class="stat-label">игр</div></div>
</div>

<div class="quote">
<p>"Codepedia ценит всех разработчиков — будь ты создатель игр, веб-разработчик или системный инженер. Каждый вклад делает наше сообщество сильнее."</p>
<div class="author">— Команда Codepedia</div>
</div>

<div class="features-grid">
<div class="feature-card" onclick="window.location.href='https://wiki.codepedia.space'">
<div class="icon">📖</div>
<h3>Wiki-энциклопедия</h3>
<p>Знания по языкам, алгоритмам, фреймворкам и инструментам</p>
<div class="tag">Статьи</div>
</div>
<div class="feature-card" onclick="window.location.href='https://courses.codepedia.space'">
<div class="icon">🎓</div>
<h3>Курсы</h3>
<p>Подготовка к олимпиадам, собеседованиям и реальным проектам</p>
<div class="tag">Обучение</div>
</div>
<div class="feature-card" onclick="window.location.href='https://hosting.codepedia.space'">
<div class="icon">🚀</div>
<h3>Хостинг</h3>
<p>Бесплатное размещение ваших проектов и веб-приложений</p>
<div class="tag">Деплой</div>
</div>
<div class="feature-card" onclick="window.location.href='https://games.codepedia.space'">
<div class="icon">🎮</div>
<h3>Игровая площадка</h3>
<p>Выкладывай свои игры, скачивай игры других разработчиков</p>
<div class="tag">Геймдев</div>
</div>
<div class="feature-card" onclick="window.location.href='https://devkit.codepedia.space'">
<div class="icon">⚡</div>
<h3>DevKit</h3>
<p>Инструменты для разработчиков: JSON, JWT, Base64, Regex</p>
<div class="tag">Утилиты</div>
</div>
<div class="feature-card" onclick="window.location.href='https://blog.codepedia.space'">
<div class="icon">📝</div>
<h3>Блог</h3>
<p>Новости, статьи и анонсы из мира Codepedia</p>
<div class="tag">Новости</div>
</div>
</div>
</div>
<div class="footer">
<p>Codepedia — свободная экосистема для разработчиков | © 2024-2026</p>
<p>Ценим каждого разработчика ❤️</p>
</div>
<script>
async function fetchCount(url) {
    try { const res = await fetch(url); if (!res.ok) return 0; const data = await res.json(); return data.length || 0; } catch(e) { return 0; }
}
async function loadStats() {
    const [articles, courses, projects, games] = await Promise.all([
        fetchCount('/api/articles'),
        fetchCount('/api/courses'),
        fetchCount('/api/projects'),
        fetchCount('/api/games')
    ]);
    document.getElementById('statArticles').textContent = articles;
    document.getElementById('statCourses').textContent = courses;
    document.getElementById('statProjects').textContent = projects;
    document.getElementById('statGames').textContent = games;
}
loadStats();
</script>
</body></html>`;

const WIKI_PAGE = `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Codepedia Wiki — Энциклопедия</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;background:#0a0e27;color:#e0e0e0}
.header{background:rgba(15,18,40,0.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,107,0,0.3);padding:16px 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}
.logo h1{font-size:28px}.code-orange{color:#ff6b00}.pedia{color:#4a90e2}
.nav-links a{color:#e0e0e0;text-decoration:none;margin-left:24px}.nav-links a:hover{color:#ff6b00}
.container{max-width:1400px;margin:0 auto;padding:30px}
.hero{text-align:center;padding:40px 20px;margin-bottom:30px}
.hero h1{font-size:42px;background:linear-gradient(135deg,#ff6b00,#4a90e2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:#a0a0a0;font-size:18px}
.section-title{font-size:24px;margin:30px 0 20px;color:#fff}
.loading{text-align:center;padding:40px;color:#666}
.empty{text-align:center;padding:40px;color:#666}
.features-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
.feature-card{background:rgba(255,255,255,0.05);border-radius:16px;padding:24px;border:1px solid rgba(255,255,255,0.1);transition:transform 0.2s;cursor:pointer}
.feature-card:hover{transform:translateY(-4px);border-color:#ff6b00}
.feature-card h3{color:#ff6b00;margin-bottom:8px}
.feature-card p{color:#a0a0a0;font-size:13px;line-height:1.5}
.feature-card .meta{font-size:11px;color:#666;margin-top:8px}
.footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;color:#666}
</style>
</head>
<body>
<div class="header">
<div class="logo"><h1><span class="code-orange">Code</span><span class="pedia">pedia</span> Wiki</h1></div>
<div class="nav-links">
<a href="https://wiki.codepedia.space">📖 Wiki</a>
<a href="https://courses.codepedia.space">🎓 Курсы</a>
<a href="https://hosting.codepedia.space">🚀 Хостинг</a>
<a href="https://games.codepedia.space">🎮 Игры</a>
<a href="https://devkit.codepedia.space">⚡ DevKit</a>
</div>
</div>
<div class="container">
<div class="hero"><h1>📚 Codepedia Wiki</h1><p>Свободная энциклопедия программирования</p></div>
<div id="articlesContainer"><div class="loading">Загрузка статей...</div></div>
</div>
<div class="footer"><p>Codepedia Wiki — свободная энциклопедия | © 2024-2026</p></div>
<script>
async function loadArticles() {
    try {
        const res = await fetch('/api/articles');
        if (!res.ok) throw new Error('Ошибка загрузки');
        const articles = await res.json();
        const container = document.getElementById('articlesContainer');
        if (!articles || !articles.length) {
            container.innerHTML = '<div class="empty">📭 Статей пока нет. Будьте первым автором!</div>';
            return;
        }
        container.innerHTML = \`<div class="features-grid">\${articles.map(a => \`
            <div class="feature-card" onclick="window.location.href='/article.html?slug=\${a.slug}'">
                <h3>\${a.title}</h3>
                <p>\${a.excerpt || 'Без описания'}</p>
                <div class="meta">👤 \${a.author_name || 'Аноним'} • 📅 \${a.date || '2024'}</div>
            </div>
        \`).join('')}</div>\`;
    } catch(e) {
        document.getElementById('articlesContainer').innerHTML = '<div class="empty">❌ Ошибка загрузки</div>';
    }
}
loadArticles();
</script>
</body></html>`;

const COURSES_PAGE = `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Курсы — Codepedia</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0e27;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;color:#e0e0e0}
.header{background:rgba(15,18,40,0.95);border-bottom:1px solid rgba(255,107,0,0.3);padding:16px 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}
.logo h1{font-size:28px}.code-orange{color:#ff6b00}.pedia{color:#4a90e2}
.nav-links a{color:#e0e0e0;text-decoration:none;margin-left:24px}.nav-links a:hover{color:#ff6b00}
.container{max-width:1400px;margin:0 auto;padding:30px}
.hero{text-align:center;padding:40px 20px;margin-bottom:30px}
.hero h1{font-size:42px;background:linear-gradient(135deg,#ff6b00,#4a90e2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:#a0a0a0;font-size:18px}
.courses-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:20px}
.course-card{background:rgba(255,255,255,0.05);border-radius:16px;padding:24px;border:1px solid rgba(255,255,255,0.1);transition:transform 0.2s;cursor:pointer}
.course-card:hover{transform:translateY(-4px);border-color:#ff6b00}
.course-card h3{color:#4a90e2;margin-bottom:8px}
.course-card p{color:#a0a0a0;font-size:14px;line-height:1.5}
.course-card .meta{font-size:12px;color:#666;margin-top:12px}
.footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;color:#666}
.loading{text-align:center;padding:40px;color:#666}
.empty{text-align:center;padding:40px;color:#666}
</style>
</head>
<body>
<div class="header">
<div class="logo"><h1><span class="code-orange">Code</span><span class="pedia">pedia</span> Courses</h1></div>
<div class="nav-links"><a href="https://wiki.codepedia.space">📖 Wiki</a><a href="https://courses.codepedia.space">🎓 Курсы</a><a href="https://hosting.codepedia.space">🚀 Хостинг</a><a href="https://games.codepedia.space">🎮 Игры</a></div>
</div>
<div class="container">
<div class="hero"><h1>🎓 Codepedia Courses</h1><p>Подготовка к ВСОШ и олимпиадам по программированию</p></div>
<div id="coursesContainer"><div class="loading">Загрузка курсов...</div></div>
</div>
<div class="footer"><p>Codepedia Courses | © 2024-2026</p></div>
<script>
async function loadCourses() {
    try {
        const res = await fetch('/api/courses');
        if (!res.ok) throw new Error('Ошибка загрузки');
        const courses = await res.json();
        const container = document.getElementById('coursesContainer');
        if (!courses || !courses.length) {
            container.innerHTML = '<div class="empty">🎓 Курсы скоро появятся</div>';
            return;
        }
        container.innerHTML = \`<div class="courses-grid">\${courses.map(c => \`
            <div class="course-card" onclick="window.location.href='/course.html?id=\${c.id}'">
                <h3>\${c.title}</h3>
                <p>\${c.description || 'Без описания'}</p>
                <div class="meta">📖 \${c.lessons_count || 0} уроков • ⏱️ \${c.duration || '—'}</div>
            </div>
        \`).join('')}</div>\`;
    } catch(e) {
        document.getElementById('coursesContainer').innerHTML = '<div class="empty">❌ Ошибка загрузки</div>';
    }
}
loadCourses();
</script>
</body></html>`;

const HOSTING_PAGE = `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Хостинг — Codepedia</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0e27;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;color:#e0e0e0}
.header{background:rgba(15,18,40,0.95);border-bottom:1px solid rgba(255,107,0,0.3);padding:16px 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}
.logo h1{font-size:28px}.code-orange{color:#ff6b00}.pedia{color:#4a90e2}
.nav-links a{color:#e0e0e0;text-decoration:none;margin-left:24px}.nav-links a:hover{color:#ff6b00}
.container{max-width:1400px;margin:0 auto;padding:30px}
.hero{text-align:center;padding:40px 20px;margin-bottom:30px}
.hero h1{font-size:42px;background:linear-gradient(135deg,#ff6b00,#4a90e2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:#a0a0a0;font-size:18px}
.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:20px}
.project-card{background:rgba(255,255,255,0.05);border-radius:16px;padding:24px;border:1px solid rgba(255,255,255,0.1);transition:transform 0.2s;cursor:pointer}
.project-card:hover{transform:translateY(-4px);border-color:#ff6b00}
.project-card h3{color:#4a90e2;margin-bottom:8px}
.project-card p{color:#a0a0a0;font-size:14px;line-height:1.5}
.project-card .meta{font-size:12px;color:#666;margin-top:12px}
.btn{display:inline-block;background:#ff6b00;color:#fff;padding:10px 24px;border-radius:40px;text-decoration:none;font-weight:600;margin-top:12px}
.btn:hover{background:#ff8533}
.footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;color:#666}
</style>
</head>
<body>
<div class="header"><div class="logo"><h1><span class="code-orange">Code</span><span class="pedia">pedia</span> Hosting</h1></div>
<div class="nav-links"><a href="https://wiki.codepedia.space">📖 Wiki</a><a href="https://courses.codepedia.space">🎓 Курсы</a><a href="https://hosting.codepedia.space">🚀 Хостинг</a><a href="https://games.codepedia.space">🎮 Игры</a></div></div>
<div class="container">
<div class="hero"><h1>🚀 Codepedia Hosting</h1><p>Бесплатный хостинг для ваших проектов</p>
<a href="https://hosting.codepedia.space/create-site.html" class="btn">✨ Создать сайт</a>
</div>
<div id="projectsContainer"><div class="loading">Загрузка проектов...</div></div>
</div>
<div class="footer"><p>Codepedia Hosting | © 2024-2026</p></div>
<script>
async function loadProjects() {
    try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Ошибка загрузки');
        const projects = await res.json();
        const container = document.getElementById('projectsContainer');
        if (!projects || !projects.length) {
            container.innerHTML = '<div class="empty" style="text-align:center;padding:40px;color:#666;">🚀 Проектов пока нет</div>';
            return;
        }
        container.innerHTML = \`<div class="projects-grid">\${projects.map(p => \`
            <div class="project-card" onclick="window.location.href='https://\${p.slug}.codepedia.space'">
                <h3>🚀 \${p.title}</h3>
                <p>\${p.description || 'Без описания'}</p>
                <div class="meta">👤 \${p.author_name || 'Аноним'} • 👁️ \${p.views || 0}</div>
            </div>
        \`).join('')}</div>\`;
    } catch(e) {
        document.getElementById('projectsContainer').innerHTML = '<div class="empty" style="text-align:center;padding:40px;color:#666;">❌ Ошибка загрузки</div>';
    }
}
loadProjects();
</script>
</body></html>`;

const GAMES_PAGE = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Игры — Codepedia Games</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#0a0e27;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;color:#e0e0e0}
        .header{background:rgba(15,18,40,0.95);border-bottom:1px solid rgba(255,107,0,0.3);padding:16px 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}
        .logo h1{font-size:28px}.code-orange{color:#ff6b00}.pedia{color:#4a90e2}
        .nav-links a{color:#e0e0e0;text-decoration:none;margin-left:24px}.nav-links a:hover{color:#ff6b00}
        .container{max-width:1400px;margin:0 auto;padding:30px}
        .hero{text-align:center;padding:40px 20px;margin-bottom:30px}
        .hero h1{font-size:42px;background:linear-gradient(135deg,#ff6b00,#4a90e2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .hero p{color:#a0a0a0;font-size:18px}
        .hero .sub{color:#666;font-size:14px;margin-top:8px}
        .games-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:25px}
        .game-card{background:rgba(255,255,255,0.05);border-radius:16px;padding:24px;border:1px solid rgba(255,255,255,0.1);transition:transform 0.3s;cursor:pointer}
        .game-card:hover{transform:translateY(-6px);border-color:#ff6b00}
        .game-card .icon{font-size:48px;margin-bottom:12px}
        .game-card h3{color:#4a90e2;margin-bottom:8px}
        .game-card p{color:#a0a0a0;font-size:13px;line-height:1.5}
        .game-card .meta{font-size:12px;color:#666;margin-top:12px}
        .game-card .tag{display:inline-block;background:rgba(255,107,0,0.2);color:#ff6b00;padding:2px 10px;border-radius:20px;font-size:11px;margin-right:5px}
        .btn{display:inline-block;background:#ff6b00;color:#fff;padding:12px 28px;border-radius:40px;text-decoration:none;font-weight:600;margin-top:12px}
        .btn:hover{background:#ff8533}
        .btn-secondary{background:transparent;border:1px solid #4a90e2;color:#4a90e2}
        .btn-secondary:hover{background:#4a90e2;color:#fff}
        .upload-section{background:rgba(255,255,255,0.03);border-radius:20px;padding:30px;margin-bottom:40px;text-align:center;border:1px solid rgba(255,255,255,0.08)}
        .upload-section h2{color:#ff6b00;margin-bottom:10px}
        .upload-section p{color:#a0a0a0;font-size:14px;margin-bottom:15px}
        .footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;color:#666;font-size:13px}
        .footer .heart{color:#ff6b00}
        .loading{text-align:center;padding:40px;color:#666}
        .empty{text-align:center;padding:40px;color:#666;background:rgba(255,255,255,0.03);border-radius:16px}
    </style>
</head>
<body>
<div class="header">
<div class="logo"><h1><span class="code-orange">Code</span><span class="pedia">pedia</span> Games</h1></div>
<div class="nav-links">
<a href="https://wiki.codepedia.space">📖 Wiki</a>
<a href="https://courses.codepedia.space">🎓 Курсы</a>
<a href="https://hosting.codepedia.space">🚀 Хостинг</a>
<a href="https://games.codepedia.space">🎮 Игры</a>
<a href="https://devkit.codepedia.space">⚡ DevKit</a>
</div>
</div>
<div class="container">
<div class="hero">
<h1>🎮 Codepedia Games</h1>
<p>Площадка для игр от разработчиков — для разработчиков</p>
<div class="sub">Выкладывай свои игры, скачивай игры других. Codepedia ценит геймдев-сообщество! ❤️</div>
</div>

<div class="upload-section">
<h2>🚀 Выложи свою игру</h2>
<p>Поделись своим творением с сообществом. Мы поддерживаем все жанры — от текстовых квестов до 3D-шутеров.</p>
<a href="https://games.codepedia.space/upload-game.html" class="btn">📤 Загрузить игру</a>
</div>

<div id="gamesContainer"><div class="loading">Загрузка игр...</div></div>
</div>
<div class="footer">
<p>Codepedia Games — площадка для геймдев-сообщества | © 2024-2026</p>
<p>Сделано с ❤️ для всех разработчиков игр</p>
</div>
<script>
async function loadGames() {
    try {
        const res = await fetch('/api/games');
        if (!res.ok) throw new Error('Ошибка загрузки');
        const games = await res.json();
        const container = document.getElementById('gamesContainer');
        if (!games || !games.length) {
            container.innerHTML = '<div class="empty">🎮 Игр пока нет. Стань первым разработчиком, кто выложит свою игру!</div>';
            return;
        }
        container.innerHTML = \`<div class="games-grid">\${games.map(g => \`
            <div class="game-card" onclick="window.location.href='/game.html?id=\${g.id}'">
                <div class="icon">\${g.icon || '🎮'}</div>
                <h3>\${g.title}</h3>
                <p>\${g.description || 'Без описания'}</p>
                <div>\${(g.tags || '').split(',').filter(t => t).map(t => \`<span class="tag">#\${t.trim()}</span>\`).join('')}</div>
                <div class="meta">👤 \${g.author_name || 'Аноним'} • 📅 \${g.created_at?.split('T')[0] || '2024'} • ⬇️ \${g.downloads || 0}</div>
            </div>
        \`).join('')}</div>\`;
    } catch(e) {
        document.getElementById('gamesContainer').innerHTML = '<div class="empty">❌ Ошибка загрузки игр</div>';
    }
}
loadGames();
</script>
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

            if (subdomain === 'wiki') return new Response(WIKI_PAGE, { headers: { 'Content-Type': 'text/html' } });
            if (subdomain === 'courses') return new Response(COURSES_PAGE, { headers: { 'Content-Type': 'text/html' } });
            if (subdomain === 'hosting') return new Response(HOSTING_PAGE, { headers: { 'Content-Type': 'text/html' } });
            if (subdomain === 'games') return new Response(GAMES_PAGE, { headers: { 'Content-Type': 'text/html' } });

            // ---- Проекты пользователей на поддоменах ----
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

        // ========== MAIN PAGE (codepedia.space) ==========
        if (path === '/' || path === '/index.html') {
            return new Response(MAIN_PAGE, { headers: { 'Content-Type': 'text/html' } });
        }

        // ========== API ==========
        // ---- Все API-эндпоинты (регистрация, логин, статьи, курсы, проекты, игры, чат, файлы) ----
        // ... (ваш существующий API код)

        return new Response('Not found', { status: 404, headers: corsHeaders });
    }
};
