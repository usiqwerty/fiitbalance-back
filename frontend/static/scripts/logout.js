async function logout() {
    try {
        const response = await fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            window.location.href = '/login';
        } else {
            console.error('Ошибка выхода:', await response.text());
        }
    } catch (error) {
        console.error('Ошибка сети:', error);
    }
}

document.querySelectorAll('.logout-button').forEach(button => {
    button.addEventListener('click', logout);
});