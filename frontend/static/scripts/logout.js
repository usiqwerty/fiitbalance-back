async function logout() {
    try {
        const response = await fetch(`/api/auth/logout`, {
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