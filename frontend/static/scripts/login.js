const apiBaseUrl = "http://127.0.0.1:8000";
const redirectUrl = "./schedule.html";

function setErrorMessage(msg) {
    if (msg === undefined) {
        // спрятать ошибку
        return;
    }
    //TODO: писать ошибку на странице
    alert(msg);
}

function login() {
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const formData = {email: login, password: password};
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
    };
    fetch(apiBaseUrl + "/api/auth/login", requestOptions)
        .then(r => {
            if (r.status === 200) {
                setErrorMessage();
                window.location.replace(redirectUrl);
            } else {
                r.json().then(eBody => setErrorMessage(eBody.detail));
            }
        })
        .catch(err => {
            setErrorMessage(err.message)
        });
}

function register() {
    const name = document.getElementById('name').value;
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    if (password !== passwordConfirm){
        setErrorMessage("Passwords do not match");
        return;
    }

    const formData = {name: name, email: login, password: password};
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
    };
    fetch(apiBaseUrl + "/api/auth/register", requestOptions)
        .then(r => {
            if (r.status === 200) {
                setErrorMessage();
                window.location.replace(redirectUrl);
            } else {
                r.json().then(eBody => setErrorMessage(eBody.detail));
            }
        })
        .catch(err => {
            setErrorMessage(err.message)
        });
}


try {
    document.getElementById("login-btn").addEventListener("click", login);
}
catch {}
try {
    document.getElementById("register-btn").addEventListener("click", register);
}
catch {}