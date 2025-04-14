const apiBaseUrl = "http://127.0.0.1:8000";

async function logout() {
    try {
        const response = await fetch(`${apiBaseUrl}/api/auth/logout`, {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            window.location.href = "/login";
        } else {
            console.error("Ошибка выхода:", await response.text());
        }
    } catch (error) {
        console.error("Ошибка сети:", error);
        window.location.href = "/login";
    }
}

document.querySelectorAll(".logout-button").forEach(button => {
    button.addEventListener("click", logout);
});