document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple authentication (for demonstration purposes)
        if (username === 'admin' && password === 'pass1234') {
            localStorage.setItem('loggedIn', 'true');
            window.location.href = 'index.html';
        } else {
            alert('Invalid username or password');
        }
    });
});
