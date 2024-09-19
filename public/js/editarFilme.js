const form_edit = document.getElementById('editarFilme');
const url = new URLSearchParams(window.location.search);
const id_url = url.get('id');

let id = document.getElementById('id_filme');
let titulo = document.getElementById("titulo");
let diretor = document.getElementById("diretor");
let duracao = document.getElementById("duracao");
let genero = document.getElementById("genero");
let ano = document.getElementById("ano_lancamento");
let enredo = document.getElementById("enredo");
let img_filme = document.getElementById("img_filme");

document.addEventListener('DOMContentLoaded', async () => {  

    const response = await fetch('api/paginas/');
    const filmes = await response.json();
    const filme = filmes.find(filme => filme.id == id_url);
    if (filme) {
        id.value = filme.id;
        titulo.value = filme.nome;
        diretor.value = filme.diretor;
        duracao.value = filme.duracao;
        genero.value = filme.genero;
        ano.value = filme.ano_lancamento;
        enredo.value = filme.enredo; 
    } else {
        alert("filme não encontrado!!");
        window.location.href = '/listar-filmes';
    }

});

form_edit.addEventListener('submit', async (e) => {

    e.preventDefault();

    const att_dados = new FormData();

    att_dados.append('nome', nome.value);
    att_dados.append('diretor', diretor.value);
    att_dados.append('duracao', duracao.value);
    att_dados.append('genero', genero.value);
    att_dados.append('ano_lancamento', ano.value);
    att_dados.append('enredo', enredo.value);
    
    if (img_filme.files.length > 0) {
        att_dados.append('img_prod', img_filme.files[0]);
    }

    await fetch(`/api/paginas/${id.value}`, {
        method: 'PUT',
        body: att_dados,
    });

    alert("filme alterado com sucesso!!");
    window.location.href = '/listar-filmes';

});