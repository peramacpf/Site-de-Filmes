const formularioCadastro = document.getElementById("cadastro");

let nome = document.getElementById("nome");
let username = document.getElementById("username");
let sobrenome = document.getElementById("sobrenome");
let email = document.getElementById("email");
let senha = document.getElementById("senha");
let confirmar_senha = document.getElementById("confirmar_senha");

formularioCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (senha.value !== confirmar_senha.value) {
        alert("As senhas não coincidem");
    } else {
        const formulario = {
            username: username.value,
            nome: nome.value,  
            sobrenome: sobrenome.value,
            email: email.value,
            senha: senha.value
        };

        await fetch('/api/paginas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formulario)
        });

        console.log(formulario);
        window.location.href = '/login';

    }
});
