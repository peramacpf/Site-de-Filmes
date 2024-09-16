const formularioLogin = document.getElementById("login");

formularioLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = document.getElementById("nome_email").value;
    const senha = document.getElementById("senha").value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({login, senha }),
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message);
        window.location.href = 'selecionar.html';
    } else {
        alert(result.message || "Não funcionou");
    }
});
