let currentSessionId = localStorage.getItem('sessionId');

async function register() {
    const email = document.getElementById('regEmail').value;
    const name = document.getElementById('regName').value;
    const password = document.getElementById('regPassword').value;
    const password2 = document.getElementById('regPassword2').value;
    
    if (password !== password2) {
        alert('Пароли не совпадают');
        return;
    }
    
    if (password.length < 6) {
        alert('Пароль должен быть минимум 6 символов');
        return;
    }
    
    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
    });
    
    const data = await res.json();
    if (data.success) {
        alert('Регистрация успешна! Теперь войдите');
        closeModal('registerModal');
        openAuthModal();
    } else {
        alert(data.error);
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (data.success) {
        currentSessionId = data.sessionId;
        localStorage.setItem('sessionId', currentSessionId);
        localStorage.setItem('user', JSON.stringify(data.user));
        closeModal('loginModal');
        updateUI();
    } else {
        alert(data.error);
    }
}

async function logout() {
    await fetch('/api/logout', {
        method: 'POST',
        headers: { 'X-Session-Id': currentSessionId }
    });
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
    currentSessionId = null;
    updateUI();
}

async function updateUI() {
    const user = localStorage.getItem('user');
    if (user && currentSessionId) {
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userInfo').style.display = 'flex';
        const userData = JSON.parse(user);
        document.getElementById('userName').textContent = userData.name || userData.email;
    } else {
        document.getElementById('authButtons').style.display = 'flex';
        document.getElementById('userInfo').style.display = 'none';
    }
}

function loginWithYandex() {
    // Яндекс OAuth
    const clientId = 'ВАШ_CLIENT_ID'; // Регистрируйте приложение на https://oauth.yandex.ru/
    const redirectUri = 'https://codepedia.space/api/yandex-callback';
    window.location.href = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
}

updateUI();
