const cadastrar = document.getElementById("cadastrar");

let primeiro_nome = document.getElementById("primeiro_nome");
let sobrenome = document.getElementById("sobrenome");
let email = document.getElementById("email");
let senha = document.getElementById("senha");
let confirmar_senha = document.getElementById("confirmar_senha");

cadastrar.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (senha.value != confirmar_senha.value) {
        alert("As senhas não coincidem");
    } else {
        const formulario = new FormData();
        formulario.append("primeiro_nome", primeiro_nome.value);
        formulario.append("sobrenome", sobrenome.value);
        formulario.append("email", email.value);
        formulario.append("senha", senha.value);

        await fetch ('/api/paginas', {
            method: 'POST',
            body: formulario
        });

        window.location.href = 'index.html';
    }
})