const formularioFilmes = document.getElementById("cadastrarFilme");

let titulo = document.getElementById("titulo");
let diretor = document.getElementById("diretor");
let duracao = document.getElementById("duracao");
let genero = document.getElementById("genero");
let ano = document.getElementById("ano_lancamento");
let enredo = document.getElementById("enredo");
let img_filme = document.getElementById("img_filme");

formularioFilmes.addEventListener('submit', async (e) => {
    e.preventDefault();

    const carregarDados = new FormData();

    carregarDados.append('titulo', titulo.value);
    carregarDados.append('diretor', diretor.value);
    carregarDados.append('duracao', duracao.value);
    carregarDados.append('genero', genero.value);
    carregarDados.append('ano_lancamento', ano.value);
    carregarDados.append('enredo', enredo.value);
    carregarDados.append('img_filme', img_filme.files[0]);

    const response = await fetch('/api/paginas/cadastro_filme', {
        method: 'POST',
        body: carregarDados,
    });

    if (confirm("Você deseja cadastrar mais um Filme? ")) {
        window.location.href = 'cadastrar.html';
    } else {
        window.location.href = 'selecionar.html';
    }

})