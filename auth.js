if (window.location.pathname.endsWith('index.html')) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'login.html';
    }
}

if (window.location.pathname.endsWith('login.html')) {
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];

        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            localStorage.setItem('loggedInUser', username);
            window.location.href = 'index.html';
        } else {
            alert('Invalid username or password');
        }
    });
}

if (window.location.pathname.endsWith('register.html')) {
    document.getElementById('registerForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.some(u => u.username === username)) {
            alert('Username already exists');
        } else {
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        }
    });
}