// ======== API БАЗОВЫЙ URL ========
const API_URL = '';

// ======== ВИКИ ========
async function loadWikis() {
    try {
        const response = await fetch('/api/wikis');
        const wikis = await response.json();
        const grid = document.getElementById('wikiGrid');
        if (!grid) return;
        
        grid.innerHTML = wikis.map(w => `
            <div class="wiki-card">
                <h3><i class="fas fa-book" style="color:#e07c2c;"></i> ${w.name}</h3>
                <div class="subdomain">📌 ${w.subdomain}.codepedia.space</div>
                <div class="desc">${w.description || 'Нет описания'}</div>
                <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;">
                    <button class="btn btn-sm btn-primary" onclick="viewWiki(${w.id})"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteWiki(${w.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки вики:', error);
    }
}

async function createWiki(e) {
    e.preventDefault();
    const name = document.getElementById('wikiName').value;
    const subdomain = document.getElementById('wikiSubdomain').value;
    const description = document.getElementById('wikiDesc').value;
    
    try {
        const response = await fetch('/api/wikis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, subdomain, description })
        });
        
        const data = await response.json();
        if (response.ok) {
            alert(`✅ Вики создана! Доступна по адресу: ${data.url}`);
            closeModal('createWikiModal');
            loadWikis();
        } else {
            alert(`❌ Ошибка: ${data.error}`);
        }
    } catch (error) {
        alert('❌ Ошибка создания вики');
    }
}

async function deleteWiki(id) {
    if (!confirm('Удалить эту вики?')) return;
    try {
        const response = await fetch(`/api/wikis/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadWikis();
        }
    } catch (error) {
        alert('Ошибка удаления');
    }
}

async function viewWiki(id) {
    try {
        const response = await fetch(`/api/wikis/${id}/articles`);
        const articles = await response.json();
        if (articles.length === 0) {
            alert('📖 В этой вики пока нет статей');
        } else {
            alert('📖 Статьи:\n' + articles.map(a => `- ${a.title}`).join('\n'));
        }
    } catch (error) {
        alert('Ошибка загрузки статей');
    }
}

async function createArticle(e) {
    e.preventDefault();
    const wikiId = document.getElementById('articleWiki').value;
    const title = document.getElementById('articleTitle').value;
    const content = document.getElementById('articleContent').value;
    
    try {
        const response = await fetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, wikiId: parseInt(wikiId) })
        });
        
        if (response.ok) {
            alert('✅ Статья создана!');
            closeModal('createArticleModal');
            loadWikis();
        }
    } catch (error) {
        alert('Ошибка создания статьи');
    }
}

// ======== ПРОЕКТЫ ========
async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;
        
        grid.innerHTML = projects.map(p => `
            <div class="project-card">
                <h3><i class="fas fa-folder" style="color:#2b6fbf;"></i> ${p.name}</h3>
                <div class="domain">🌐 ${p.subdomain}.codepedia.space</div>
                <div class="desc" style="font-size:13px;color:#636e72;margin:8px 0;">${p.description || 'Нет описания'}</div>
                <div class="actions">
                    <button class="btn btn-sm btn-danger" onclick="deleteProject(${p.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки проектов:', error);
    }
}

async function createProject(e) {
    e.preventDefault();
    const name = document.getElementById('projectName').value;
    const subdomain = document.getElementById('projectSubdomain').value;
    const description = document.getElementById('projectDesc').value;
    
    try {
        const response = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, subdomain, description })
        });
        
        const data = await response.json();
        if (response.ok) {
            alert(`✅ Проект создан! Доступен по адресу: ${data.url}`);
            closeModal('createProjectModal');
            loadProjects();
        }
    } catch (error) {
        alert('Ошибка создания проекта');
    }
}

async function deleteProject(id) {
    if (!confirm('Удалить проект?')) return;
    try {
        await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        loadProjects();
    } catch (error) {
        alert('Ошибка удаления');
    }
}

// ======== ИГРЫ ========
async function loadGames() {
    try {
        const response = await fetch('/api/games');
        const games = await response.json();
        const grid = document.getElementById('gamesGrid');
        if (!grid) return;
        
        grid.innerHTML = games.map(g => `
            <div class="game-card">
                <div class="game-image" style="background:linear-gradient(135deg, #2b6fbf, #e07c2c);font-size:48px;display:flex;align-items:center;justify-content:center;height:140px;">
                    ${g.image || '🎮'}
                </div>
                <div class="game-info">
                    <h3>${g.name}</h3>
                    <span class="game-genre">${g.genre}</span>
                    <div class="game-desc">${g.description || 'Нет описания'}</div>
                    <div style="font-size:12px;color:#636e72;">⬇️ ${g.downloads || 0} скачиваний</div>
                    <div class="game-actions">
                        <a href="${g.url}" target="_blank" class="btn btn-sm btn-success" onclick="downloadGame(${g.id})">
                            <i class="fas fa-download"></i> Скачать
                        </a>
                        <button class="btn btn-sm btn-danger" onclick="deleteGame(${g.id})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки игр:', error);
    }
}

async function uploadGame(e) {
    e.preventDefault();
    const name = document.getElementById('gameName').value;
    const genre = document.getElementById('gameGenre').value;
    const description = document.getElementById('gameDesc').value;
    const url = document.getElementById('gameUrl').value;
    const image = document.getElementById('gameImage').value || '🎮';
    
    try {
        const response = await fetch('/api/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, genre, description, url, image })
        });
        
        if (response.ok) {
            alert('✅ Игра загружена!');
            closeModal('uploadGameModal');
            loadGames();
        }
    } catch (error) {
        alert('Ошибка загрузки игры');
    }
}

async function deleteGame(id) {
    if (!confirm('Удалить игру?')) return;
    try {
        await fetch(`/api/games/${id}`, { method: 'DELETE' });
        loadGames();
    } catch (error) {
        alert('Ошибка удаления');
    }
}

async function downloadGame(id) {
    try {
        await fetch(`/api/games/${id}/download`, { method: 'POST' });
    } catch (error) {
        console.error('Ошибка учета скачивания');
    }
}

// ======== ЧАТ ========
async function loadMessages(room = 'general') {
    try {
        const response = await fetch(`/api/chat/${room}`);
        const messages = await response.json();
        const container = document.getElementById('chatMessages');
        if (!container) return;
        
        container.innerHTML = messages.map(m => `
            <div class="message ${m.author === 'Вы' ? 'sent' : 'received'}">
                <div class="message-avatar"><i class="fas fa-user"></i></div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-author">${m.author}</span>
                        <span class="message-time">${new Date(m.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p>${m.text}</p>
                </div>
            </div>
        `).join('');
        container.scrollTop = container.scrollHeight;
    } catch (error) {
        console.error('Ошибка загрузки сообщений:', error);
    }
}

async function sendMessage(e) {
    if (e && e.key !== 'Enter') return;
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;
    
    try {
        await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                room: 'general', 
                author: 'Пользователь', 
                text 
            })
        });
        input.value = '';
        loadMessages();
    } catch (error) {
        alert('Ошибка отправки сообщения');
    }
}

// ======== ОБЩИЕ ФУНКЦИИ ========
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function openCreateWiki() {
    document.getElementById('createWikiModal').classList.add('active');
}

function openCreateArticle() {
    // Загружаем вики для выбора
    fetch('/api/wikis')
        .then(r => r.json())
        .then(wikis => {
            const select = document.getElementById('articleWiki');
            select.innerHTML = wikis.map(w => 
                `<option value="${w.id}">${w.name}</option>`
            ).join('');
            document.getElementById('createArticleModal').classList.add('active');
        });
}

function openCreateProject() {
    document.getElementById('createProjectModal').classList.add('active');
}

function openUploadGame() {
    document.getElementById('uploadGameModal').classList.add('active');
}

function filterWikis() {
    const search = document.getElementById('wikiSearch')?.value.toLowerCase() || '';
    document.querySelectorAll('.wiki-card').forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(search) ? 'block' : 'none';
    });
}

// ======== ЗАГРУЗКА СТАТИСТИКИ ========
async function loadStats() {
    try {
        const [wikisRes, projectsRes, gamesRes] = await Promise.all([
            fetch('/api/wikis'),
            fetch('/api/projects'),
            fetch('/api/games')
        ]);
        
        const wikis = await wikisRes.json();
        const projects = await projectsRes.json();
        const games = await gamesRes.json();
        
        document.getElementById('wikiCount').textContent = wikis.length;
        document.getElementById('projectCount').textContent = projects.length;
        document.getElementById('gameCount').textContent = games.length;
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
    }
}

// ======== ИНИЦИАЛИЗАЦИЯ ========
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path === '/' || path === '/index.html') {
        loadStats();
    }
    if (path.includes('wiki.html')) {
        loadWikis();
    }
    if (path.includes('hosting.html')) {
        loadProjects();
    }
    if (path.includes('games.html')) {
        loadGames();
    }
    if (path.includes('chat.html')) {
        loadMessages();
    }
    
    // Закрытие модалок
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('active');
        });
    });
});
