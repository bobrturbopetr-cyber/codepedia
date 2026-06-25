// ========== HTML-СТРАНИЦЫ С ПРАВИЛЬНЫМ ОТОБРАЖЕНИЕМ ДАННЫХ ==========

const MAIN_PAGE = `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Codepedia — Экосистема для разработчиков</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;background:#0a0e27;color:#e0e0e0}
.header{background:rgba(15,18,40,0.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,107,0,0.3);padding:12px 24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}
.logo h1{font-size:24px}.code-orange{color:#ff6b00}.pedia{color:#4a90e2}
.nav-links a{color:#e0e0e0;text-decoration:none;margin-left:20px;font-size:14px}
.nav-links a:hover{color:#ff6b00}
.auth-buttons{display:flex;gap:10px;align-items:center}
.auth-buttons .login{background:transparent;border:1px solid #4a90e2;color:#4a90e2;padding:6px 16px;border-radius:30px;cursor:pointer}
.auth-buttons .register{background:#ff6b00;border:none;color:#fff;padding:6px 16px;border-radius:30px;cursor:pointer}
.auth-buttons .login:hover{background:#4a90e2;color:#fff}
.auth-buttons .register:hover{background:#ff8533}
.user-info{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.05);padding:4px 16px 4px 8px;border-radius:50px}
.user-avatar{width:32px;height:32px;border-radius:50%;border:2px solid #ff6b00;object-fit:cover}
.user-name{font-size:13px}
.logout-btn{background:transparent;border:1px solid #666;color:#999;padding:4px 12px;border-radius:20px;cursor:pointer;font-size:11px}
.logout-btn:hover{background:#ffebee;border-color:#ff5252;color:#ff1744}
.container{max-width:1400px;margin:0 auto;padding:20px 30px}
.hero{text-align:center;padding:40px 20px}
.hero h1{font-size:48px;background:linear-gradient(135deg,#ff6b00,#4a90e2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{font-size:18px;color:#a0a0a0}
.stats{display:flex;gap:40px;justify-content:center;margin:20px 0;flex-wrap:wrap}
.stat{text-align:center}
.stat-number{font-size:32px;font-weight:700;color:#ff6b00}
.stat-label{font-size:13px;color:#a0a0a0}
.features-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px;margin:30px 0}
.feature-card{background:rgba(255,255,255,0.05);border-radius:16px;padding:24px;text-align:center;border:1px solid rgba(255,255,255,0.1);transition:transform 0.2s;cursor:pointer}
.feature-card:hover{transform:translateY(-4px);border-color:#ff6b00}
.feature-card .icon{font-size:40px;margin-bottom:10px}
.feature-card h3{color:#ff6b00;font-size:18px;margin-bottom:6px}
.feature-card p{color:#a0a0a0;font-size:13px}
.btn{display:inline-block;background:#ff6b00;color:#fff;padding:10px 28px;border-radius:40px;text-decoration:none;font-weight:600}
.btn:hover{background:#ff8533}
.footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;color:#666;font-size:13px}
.modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:1000;justify-content:center;align-items:center}
.modal.active{display:flex}
.modal-content{background:#1a1f3a;padding:30px;border-radius:20px;width:400px;max-width:90%;border:1px solid rgba(255,255,255,0.1)}
.modal-content h2{color:#ff6b00;margin-bottom:20px}
.modal-content input{width:100%;padding:12px;margin:10px 0;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-size:14px}
.modal-content input:focus{outline:none;border-color:#ff6b00}
.modal-content button{width:100%;padding:12px;border:none;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;margin-top:10px}
.modal-content .btn-primary{background:#ff6b00;color:#fff}
.modal-content .btn-primary:hover{background:#ff8533}
.modal-content .close{position:absolute;top:15px;right:20px;font-size:28px;cursor:pointer;color:#999}
.modal-content .close:hover{color:#fff}
.modal-content .switch-link{text-align:center;margin-top:15px;font-size:13px;color:#a0a0a0}
.modal-content .switch-link a{color:#ff6b00;cursor:pointer}
.error{color:#ff5252;font-size:13px;margin-top:5px;display:none}
.success{color:#4caf50;font-size:13px;margin-top:5px;display:none}
@media(max-width:768px){.hero h1{font-size:32px}.nav-links{margin-top:10px}.stats{gap:15px}}
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
<div id="authBlock" class="auth-buttons">
<button class="login" onclick="openLoginModal()">Вход</button>
<button class="register" onclick="openRegisterModal()">Регистрация</button>
</div>
</div>
<div class="container">
<div class="hero">
<h1>🚀 Codepedia</h1>
<p>Экосистема для разработчиков всех направлений</p>
<div class="stats">
<div class="stat"><div class="stat-number" id="statArticles">0</div><div class="stat-label">статей</div></div>
<div class="stat"><div class="stat-number" id="statCourses">0</div><div class="stat-label">курсов</div></div>
<div class="stat"><div class="stat-number" id="statProjects">0</div><div class="stat-label">проектов</div></div>
<div class="stat"><div class="stat-number" id="statGames">0</div><div class="stat-label">игр</div></div>
</div>
<a href="https://wiki.codepedia.space" class="btn">📖 Начать изучение</a>
</div>
</div>
<div class="footer"><p>Codepedia — экосистема для разработчиков | © 2024-2026 ❤️</p></div>
<script>
async function fetchCount(url){try{const res=await fetch(url);if(!res.ok)return 0;const data=await res.json();return data.length||0;}catch(e){return 0;}}
async function loadStats(){
const [articles,courses,projects,games]=await Promise.all([
fetchCount('/api/articles'),fetchCount('/api/courses'),fetchCount('/api/projects'),fetchCount('/api/games')
]);
document.getElementById('statArticles').textContent=articles;
document.getElementById('statCourses').textContent=courses;
document.getElementById('statProjects').textContent=projects;
document.getElementById('statGames').textContent=games;
}
loadStats();

let currentUser=null;
let currentSessionId=localStorage.getItem('sessionId');

function openLoginModal(){document.getElementById('loginModal').classList.add('active');}
function closeLoginModal(){document.getElementById('loginModal').classList.remove('active');}
function openRegisterModal(){document.getElementById('registerModal').classList.add('active');}
function closeRegisterModal(){document.getElementById('registerModal').classList.remove('active');}
window.onclick=function(e){if(e.target.classList.contains('modal')){e.target.classList.remove('active');}}

async function register(){
const email=document.getElementById('regEmail').value;
const name=document.getElementById('regName').value;
const password=document.getElementById('regPassword').value;
const password2=document.getElementById('regPassword2').value;
const errorDiv=document.getElementById('registerError');
const successDiv=document.getElementById('registerSuccess');
errorDiv.style.display='none';successDiv.style.display='none';
if(!email||!password){errorDiv.textContent='Заполните все поля';errorDiv.style.display='block';return;}
if(password!==password2){errorDiv.textContent='Пароли не совпадают';errorDiv.style.display='block';return;}
if(password.length<6){errorDiv.textContent='Пароль минимум 6 символов';errorDiv.style.display='block';return;}
try{
const res=await fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,name:name||email.split('@')[0]})});
const data=await res.json();
if(res.ok&&data.success){successDiv.textContent='Регистрация успешна! Теперь войдите.';successDiv.style.display='block';setTimeout(()=>{closeRegisterModal();openLoginModal();document.getElementById('loginEmail').value=email;},1500);}
else{errorDiv.textContent=data.error||'Ошибка регистрации';errorDiv.style.display='block';}
}catch(e){errorDiv.textContent='Ошибка соединения';errorDiv.style.display='block';}
}

async function login(){
const email=document.getElementById('loginEmail').value;
const password=document.getElementById('loginPassword').value;
const errorDiv=document.getElementById('loginError');
errorDiv.style.display='none';
if(!email||!password){errorDiv.textContent='Введите email и пароль';errorDiv.style.display='block';return;}
try{
const res=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
const data=await res.json();
if(res.ok&&data.success){
localStorage.setItem('sessionId',data.sessionId);
localStorage.setItem('user',JSON.stringify(data.user));
closeLoginModal();
updateUI();
location.reload();
}else{errorDiv.textContent=data.error||'Ошибка входа';errorDiv.style.display='block';}
}catch(e){errorDiv.textContent='Ошибка соединения';errorDiv.style.display='block';}
}

async function logout(){
const sessionId=localStorage.getItem('sessionId');
if(sessionId)await fetch('/api/logout',{method:'POST',headers:{'X-Session-Id':sessionId}});
localStorage.removeItem('sessionId');localStorage.removeItem('user');
updateUI();location.reload();
}
function updateUI(){
const sessionId=localStorage.getItem('sessionId');
const userStr=localStorage.getItem('user');
const authBlock=document.getElementById('authBlock');
if(sessionId&&userStr){
const user=JSON.parse(userStr);
authBlock.innerHTML='<div class="user-info"><img class="user-avatar" src="'+(user.avatar||'https://api.dicebear.com/7.x/initials/svg?seed='+encodeURIComponent(user.name))+'"><span class="user-name">'+(user.name||user.email)+'</span><button class="logout-btn" onclick="logout()">Выйти</button></div>';
}else{
authBlock.innerHTML='<button class="login" onclick="openLoginModal()">Вход</button><button class="register" onclick="openRegisterModal()">Регистрация</button>';
}
}
updateUI();
</script>
<!-- Модалки -->
<div id="loginModal" class="modal"><div class="modal-content" style="position:relative;"><span class="close" onclick="closeLoginModal()">&times;</span><h2>🔐 Вход</h2><div id="loginError" class="error"></div><input type="email" id="loginEmail" placeholder="Email"><input type="password" id="loginPassword" placeholder="Пароль"><button class="btn-primary" onclick="login()">Войти</button><div class="switch-link">Нет аккаунта? <a onclick="closeLoginModal();openRegisterModal()">Зарегистрируйтесь</a></div></div></div>
<div id="registerModal" class="modal"><div class="modal-content" style="position:relative;"><span class="close" onclick="closeRegisterModal()">&times;</span><h2>📝 Регистрация</h2><div id="registerError" class="error"></div><div id="registerSuccess" class="success"></div><input type="email" id="regEmail" placeholder="Email"><input type="text" id="regName" placeholder="Имя"><input type="password" id="regPassword" placeholder="Пароль (мин. 6)"><input type="password" id="regPassword2" placeholder="Повторите пароль"><button class="btn-primary" onclick="register()">Зарегистрироваться</button><div class="switch-link">Уже есть аккаунт? <a onclick="closeRegisterModal();openLoginModal()">Войдите</a></div></div></div>
</body></html>`;

const WIKI_PAGE = `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Wiki — Codepedia</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0e27;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;color:#e0e0e0}
.header{background:rgba(15,18,40,0.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,107,0,0.3);padding:12px 24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}
.logo h1{font-size:24px}.code-orange{color:#ff6b00}.pedia{color:#4a90e2}
.nav-links a{color:#e0e0e0;text-decoration:none;margin-left:20px;font-size:14px}
.nav-links a:hover{color:#ff6b00}
.container{max-width:1400px;margin:0 auto;padding:20px}
.hero{text-align:center;padding:40px 20px}
.hero h1{font-size:42px;background:linear-gradient(135deg,#ff6b00,#4a90e2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:#a0a0a0;font-size:18px}
.articles-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;margin-top:30px}
.article-card{background:rgba(255,255,255,0.05);border-radius:16px;padding:20px;border:1px solid rgba(255,255,255,0.1);transition:transform 0.2s;cursor:pointer}
.article-card:hover{transform:translateY(-4px);border-color:#ff6b00}
.article-card h3{color:#ff6b00;margin-bottom:8px}
.article-card p{color:#a0a0a0;font-size:13px;line-height:1.5}
.article-card .meta{font-size:12px;color:#666;margin-top:10px}
.footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;color:#666}
.loading{text-align:center;padding:40px;color:#666}
.empty{text-align:center;padding:40px;color:#666}
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
</div>
</div>
<div class="container">
<div class="hero"><h1>📚 Codepedia Wiki</h1><p>Свободная энциклопедия программирования</p></div>
<div id="articlesContainer"><div class="loading">Загрузка статей...</div></div>
</div>
<div class="footer"><p>Codepedia Wiki — свободная энциклопедия | © 2024-2026</p></div>
<script>
async function loadArticles(){
try{
const res=await fetch('/api/articles');
if(!res.ok)throw new Error('Ошибка загрузки');
const data=await res.json();
const container=document.getElementById('articlesContainer');
if(!data||!data.length){
container.innerHTML='<div class="empty">📭 Статей пока нет</div>';
return;
}
container.innerHTML='<div class="articles-grid">'+data.map(a=>\`
<div class="article-card" onclick="location.href='/article.html?slug=\${a.slug}'">
<h3>\${a.title}</h3>
<p>\${a.excerpt||'Без описания'}</p>
<div class="meta">👤 \${a.author_name||'Аноним'} • 📅 \${a.date||'2024'} • 👁️ \${a.views||0}</div>
</div>
\`).join('')+'</div>';
}catch(e){
document.getElementById('articlesContainer').innerHTML='<div class="empty">❌ Ошибка загрузки</div>';
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
.header{background:rgba(15,18,40,0.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,107,0,0.3);padding:12px 24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}
.logo h1{font-size:24px}.code-orange{color:#ff6b00}.pedia{color:#4a90e2}
.nav-links a{color:#e0e0e0;text-decoration:none;margin-left:20px;font-size:14px}
.nav-links a:hover{color:#ff6b00}
.container{max-width:1400px;margin:0 auto;padding:20px}
.hero{text-align:center;padding:40px 20px}
.hero h1{font-size:42px;background:linear-gradient(135deg,#ff6b00,#4a90e2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:#a0a0a0;font-size:18px}
.courses-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:20px;margin-top:30px}
.course-card{background:rgba(255,255,255,0.05);border-radius:16px;padding:20px;border:1px solid rgba(255,255,255,0.1);transition:transform 0.2s;cursor:pointer}
.course-card:hover{transform:translateY(-4px);border-color:#ff6b00}
.course-card h3{color:#4a90e2;margin-bottom:8px}
.course-card p{color:#a0a0a0;font-size:13px;line-height:1.5}
.course-card .meta{font-size:12px;color:#666;margin-top:10px}
.footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;color:#666}
.loading{text-align:center;padding:40px;color:#666}
.empty{text-align:center;padding:40px;color:#666}
</style>
</head>
<body>
<div class="header">
<div class="logo"><h1><span class="code-orange">Code</span><span class="pedia">pedia</span> Courses</h1></div>
<div class="nav-links">
<a href="https://wiki.codepedia.space">📖 Wiki</a>
<a href="https://courses.codepedia.space">🎓 Курсы</a>
<a href="https://hosting.codepedia.space">🚀 Хостинг</a>
<a href="https://games.codepedia.space">🎮 Игры</a>
</div>
</div>
<div class="container">
<div class="hero"><h1>🎓 Codepedia Courses</h1><p>Подготовка к олимпиадам по программированию</p></div>
<div id="coursesContainer"><div class="loading">Загрузка курсов...</div></div>
</div>
<div class="footer"><p>Codepedia Courses | © 2024-2026</p></div>
<script>
async function loadCourses(){
try{
const res=await fetch('/api/courses');
if(!res.ok)throw new Error('Ошибка загрузки');
const data=await res.json();
const container=document.getElementById('coursesContainer');
if(!data||!data.length){
container.innerHTML='<div class="empty">🎓 Курсов пока нет</div>';
return;
}
container.innerHTML='<div class="courses-grid">'+data.map(c=>\`
<div class="course-card" onclick="location.href='/course.html?id=\${c.id}'">
<h3>\${c.title}</h3>
<p>\${c.description||'Без описания'}</p>
<div class="meta">📖 \${c.lessons_count||0} уроков • ⏱️ \${c.duration||'—'} • \${c.level||'Начинающий'}</div>
</div>
\`).join('')+'</div>';
}catch(e){
document.getElementById('coursesContainer').innerHTML='<div class="empty">❌ Ошибка загрузки</div>';
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
.header{background:rgba(15,18,40,0.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,107,0,0.3);padding:12px 24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}
.logo h1{font-size:24px}.code-orange{color:#ff6b00}.pedia{color:#4a90e2}
.nav-links a{color:#e0e0e0;text-decoration:none;margin-left:20px;font-size:14px}
.nav-links a:hover{color:#ff6b00}
.container{max-width:1400px;margin:0 auto;padding:20px}
.hero{text-align:center;padding:40px 20px}
.hero h1{font-size:42px;background:linear-gradient(135deg,#ff6b00,#4a90e2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:#a0a0a0;font-size:18px}
.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:20px;margin-top:30px}
.project-card{background:rgba(255,255,255,0.05);border-radius:16px;padding:20px;border:1px solid rgba(255,255,255,0.1);transition:transform 0.2s;cursor:pointer}
.project-card:hover{transform:translateY(-4px);border-color:#ff6b00}
.project-card h3{color:#4a90e2;margin-bottom:8px}
.project-card p{color:#a0a0a0;font-size:13px;line-height:1.5}
.project-card .meta{font-size:12px;color:#666;margin-top:10px}
.btn{display:inline-block;background:#ff6b00;color:#fff;padding:10px 24px;border-radius:40px;text-decoration:none;font-weight:600;margin-top:12px}
.btn:hover{background:#ff8533}
.footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;color:#666}
.loading{text-align:center;padding:40px;color:#666}
.empty{text-align:center;padding:40px;color:#666}
</style>
</head>
<body>
<div class="header">
<div class="logo"><h1><span class="code-orange">Code</span><span class="pedia">pedia</span> Hosting</h1></div>
<div class="nav-links">
<a href="https://wiki.codepedia.space">📖 Wiki</a>
<a href="https://courses.codepedia.space">🎓 Курсы</a>
<a href="https://hosting.codepedia.space">🚀 Хостинг</a>
<a href="https://games.codepedia.space">🎮 Игры</a>
</div>
</div>
<div class="container">
<div class="hero"><h1>🚀 Codepedia Hosting</h1><p>Бесплатный хостинг для ваших проектов</p>
<a href="https://hosting.codepedia.space/create-site.html" class="btn">✨ Создать сайт</a>
</div>
<div id="projectsContainer"><div class="loading">Загрузка проектов...</div></div>
</div>
<div class="footer"><p>Codepedia Hosting | © 2024-2026</p></div>
<script>
async function loadProjects(){
try{
const res=await fetch('/api/projects');
if(!res.ok)throw new Error('Ошибка загрузки');
const data=await res.json();
const container=document.getElementById('projectsContainer');
if(!data||!data.length){
container.innerHTML='<div class="empty">🚀 Проектов пока нет</div>';
return;
}
container.innerHTML='<div class="projects-grid">'+data.map(p=>\`
<div class="project-card" onclick="location.href='https://\${p.slug}.codepedia.space'">
<h3>🚀 \${p.title}</h3>
<p>\${p.description||'Без описания'}</p>
<div class="meta">👤 \${p.author_name||'Аноним'} • 👁️ \${p.views||0}</div>
</div>
\`).join('')+'</div>';
}catch(e){
document.getElementById('projectsContainer').innerHTML='<div class="empty">❌ Ошибка загрузки</div>';
}
}
loadProjects();
</script>
</body></html>`;

const GAMES_PAGE = `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Игры — Codepedia</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0e27;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;color:#e0e0e0}
.header{background:rgba(15,18,40,0.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,107,0,0.3);padding:12px 24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}
.logo h1{font-size:24px}.code-orange{color:#ff6b00}.pedia{color:#4a90e2}
.nav-links a{color:#e0e0e0;text-decoration:none;margin-left:20px;font-size:14px}
.nav-links a:hover{color:#ff6b00}
.container{max-width:1400px;margin:0 auto;padding:20px}
.hero{text-align:center;padding:40px 20px}
.hero h1{font-size:42px;background:linear-gradient(135deg,#ff6b00,#4a90e2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:#a0a0a0;font-size:18px}
.games-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;margin-top:30px}
.game-card{background:rgba(255,255,255,0.05);border-radius:16px;padding:20px;border:1px solid rgba(255,255,255,0.1);transition:transform 0.2s;cursor:pointer}
.game-card:hover{transform:translateY(-4px);border-color:#ff6b00}
.game-card h3{color:#ff6b00;margin-bottom:8px}
.game-card p{color:#a0a0a0;font-size:13px;line-height:1.5}
.game-card .meta{font-size:12px;color:#666;margin-top:10px}
.btn{display:inline-block;background:#ff6b00;color:#fff;padding:10px 24px;border-radius:40px;text-decoration:none;font-weight:600;margin-top:12px}
.btn:hover{background:#ff8533}
.footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;color:#666}
.loading{text-align:center;padding:40px;color:#666}
.empty{text-align:center;padding:40px;color:#666}
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
</div>
</div>
<div class="container">
<div class="hero"><h1>🎮 Codepedia Games</h1><p>Площадка для игр от разработчиков</p>
<a href="https://games.codepedia.space/upload-game.html" class="btn">📤 Выложить свою игру</a>
</div>
<div id="gamesContainer"><div class="loading">Загрузка игр...</div></div>
</div>
<div class="footer"><p>Codepedia Games | © 2024-2026</p></div>
<script>
async function loadGames(){
try{
const res=await fetch('/api/games');
if(!res.ok)throw new Error('Ошибка загрузки');
const data=await res.json();
const container=document.getElementById('gamesContainer');
if(!data||!data.length){
container.innerHTML='<div class="empty">🎮 Игр пока нет</div>';
return;
}
container.innerHTML='<div class="games-grid">'+data.map(g=>\`
<div class="game-card" onclick="location.href='/game.html?id=\${g.id}'">
<h3>\${g.icon||'🎮'} \${g.title}</h3>
<p>\${g.description||'Без описания'}</p>
<div class="meta">👤 \${g.author_name||'Аноним'} • ⬇️ \${g.downloads||0}</div>
</div>
\`).join('')+'</div>';
}catch(e){
document.getElementById('gamesContainer').innerHTML='<div class="empty">❌ Ошибка загрузки</div>';
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

        // ========== ПОДДОМЕНЫ ==========
        if (hostname !== 'codepedia.space' && hostname.endsWith('.codepedia.space')) {
            const subdomain = hostname.replace('.codepedia.space', '');
            if (subdomain === 'wiki') return new Response(WIKI_PAGE, { headers: { 'Content-Type': 'text/html' } });
            if (subdomain === 'courses') return new Response(COURSES_PAGE, { headers: { 'Content-Type': 'text/html' } });
            if (subdomain === 'hosting') return new Response(HOSTING_PAGE, { headers: { 'Content-Type': 'text/html' } });
            if (subdomain === 'games') return new Response(GAMES_PAGE, { headers: { 'Content-Type': 'text/html' } });
            
            // Проекты пользователей
            try {
                const project = await env.DB.prepare(
                    "SELECT id, slug, title, files FROM projects WHERE slug = ? AND published = 1"
                ).bind(subdomain).first();
                if (project) {
                    let files = {};
                    try { files = JSON.parse(project.files || '{}'); } catch(e) {}
                    let filePath = path === '/' ? '/index.html' : path;
                    if (filePath.startsWith('/')) filePath = filePath.substring(1);
                    let content = files[filePath] || files['index.html'];
                    if (content) {
                        ctx.waitUntil(env.DB.prepare("UPDATE projects SET views = views + 1 WHERE slug = ?").bind(subdomain).run());
                        return new Response(content, { headers: { 'Content-Type': 'text/html' } });
                    }
                    return new Response(`<h1>🚀 ${project.title}</h1><p>Сайт создан на Codepedia Hosting</p><p>Файл не найден</p>`, { headers: { 'Content-Type': 'text/html' } });
                }
                return new Response(`<h1>❌ Проект не найден</h1><p>${subdomain}.codepedia.space не существует</p>`, { status: 404, headers: { 'Content-Type': 'text/html' } });
            } catch(e) {
                return new Response(`Ошибка: ${e.message}`, { status: 500 });
            }
        }

        // ========== ГЛАВНАЯ СТРАНИЦА ==========
        if (path === '/' || path === '/index.html') {
            return new Response(MAIN_PAGE, { headers: { 'Content-Type': 'text/html' } });
        }

        // ========== API ==========
        
        // ---- Регистрация ----
        if (path === '/api/register' && request.method === 'POST') {
            try {
                const { email, password, name } = await request.json();
                if (!email || !password) return new Response(JSON.stringify({ error: 'Email и пароль обязательны' }), { headers: corsHeaders, status: 400 });
                const salt = 'codepedia-salt';
                const encoder = new TextEncoder();
                const data = encoder.encode(password + salt);
                const hash = await crypto.subtle.digest('SHA-256', data);
                const passwordHash = btoa(String.fromCharCode(...new Uint8Array(hash)));
                const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
                if (existing) return new Response(JSON.stringify({ error: 'Пользователь уже существует' }), { headers: corsHeaders, status: 409 });
                const result = await env.DB.prepare("INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'user')").bind(email, passwordHash, name || email.split('@')[0]).run();
                return new Response(JSON.stringify({ success: true, userId: result.meta.last_row_id }), { headers: corsHeaders });
            } catch (err) {
                return new Response(JSON.stringify({ error: err.message }), { headers: corsHeaders, status: 500 });
            }
        }

        // ---- Логин ----
        if (path === '/api/login' && request.method === 'POST') {
            try {
                const { email, password } = await request.json();
                const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
                if (!user) return new Response(JSON.stringify({ error: 'Пользователь не найден' }), { headers: corsHeaders, status: 401 });
                const salt = 'codepedia-salt';
                const encoder = new TextEncoder();
                const data = encoder.encode(password + salt);
                const hash = await crypto.subtle.digest('SHA-256', data);
                const passwordHash = btoa(String.fromCharCode(...new Uint8Array(hash)));
                if (passwordHash !== user.password_hash) {
                    return new Response(JSON.stringify({ error: 'Неверный пароль' }), { headers: corsHeaders, status: 401 });
                }
                const sessionId = crypto.randomUUID();
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 30);
                await env.DB.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").bind(sessionId, user.id, expiresAt.toISOString()).run();
                await env.DB.prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?").bind(user.id).run();
                return new Response(JSON.stringify({
                    success: true,
                    sessionId,
                    user: { id: user.id, email: user.email, name: user.name, role: user.role }
                }), { headers: corsHeaders });
            } catch (err) {
                return new Response(JSON.stringify({ error: err.message }), { headers: corsHeaders, status: 500 });
            }
        }

        // ---- Проверка сессии ----
        if (path === '/api/me' && request.method === 'GET') {
            const sessionId = request.headers.get('X-Session-Id');
            if (!sessionId) return new Response(JSON.stringify({ error: 'Не авторизован' }), { headers: corsHeaders, status: 401 });
            const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP").bind(sessionId).first();
            if (!session) return new Response(JSON.stringify({ error: 'Сессия истекла' }), { headers: corsHeaders, status: 401 });
            const user = await env.DB.prepare("SELECT id, email, name, role FROM users WHERE id = ?").bind(session.user_id).first();
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
            const articles = await env.DB.prepare("SELECT id, title, slug, excerpt, author_name, date, views FROM articles WHERE status = 'published' OR status IS NULL ORDER BY date DESC").all();
            return new Response(JSON.stringify(articles.results), { headers: corsHeaders });
        }

        // ---- Курсы ----
        if (path === '/api/courses' && request.method === 'GET') {
            const courses = await env.DB.prepare("SELECT * FROM courses ORDER BY id").all();
            return new Response(JSON.stringify(courses.results), { headers: corsHeaders });
        }

        // ---- Проекты ----
        if (path === '/api/projects' && request.method === 'GET') {
            const projects = await env.DB.prepare("SELECT id, slug, title, description, author_name, views, created_at FROM projects WHERE published = 1 ORDER BY created_at DESC").all();
            return new Response(JSON.stringify(projects.results), { headers: corsHeaders });
        }

        // ---- Игры ----
        if (path === '/api/games' && request.method === 'GET') {
            const games = await env.DB.prepare("SELECT id, title, slug, description, icon, tags, author_name, downloads, created_at FROM games ORDER BY created_at DESC").all();
            return new Response(JSON.stringify(games.results), { headers: corsHeaders });
        }

        return new Response('Not found', { status: 404, headers: corsHeaders });
    }
};
