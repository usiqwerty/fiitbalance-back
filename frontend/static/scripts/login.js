const redirectUrl = "/schedule";


function setErrorMessage(msg) {
    const errorBlock = document.getElementById('error-message');

    if (!errorBlock) return;

    if (!msg) {
        errorBlock.classList.add('hidden');
        return;
    }

    errorBlock.textContent = msg;
    errorBlock.classList.remove('hidden');
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
    fetch("/api/auth/login", requestOptions)
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
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    if (password !== passwordConfirm){
        setErrorMessage("Passwords do not match");
        return;
    }

    const formData = {email: login, password: password};
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
    };
    fetch("/api/auth/register", requestOptions)
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