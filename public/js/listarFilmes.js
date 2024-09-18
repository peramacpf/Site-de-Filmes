const listaFilmes = document.getElementById("listaFilmes");

document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch('/api/paginas/');
    const filmes = await response.json();
    listarFilmes(filmes);
});

const listarFilmes = (filmes) => {
    listaFilmes.innerHTML = ''; // Corrigido de listarFilmes.innerHTML para listaFilmes.innerHTML

    filmes.forEach(filme => {
        const tr = document.createElement('tr');

        const td_id = document.createElement('td');
        td_id.textContent = filme.id;
        tr.appendChild(td_id);

        const td_titulo = document.createElement('td');
        td_titulo.textContent = filme.nome;
        tr.appendChild(td_titulo);

        const td_diretor = document.createElement('td');
        td_diretor.textContent = filme.diretor;
        tr.appendChild(td_diretor);

        const td_duracao = document.createElement('td');
        td_duracao.textContent = `${filme.duracao} minutos`;
        tr.appendChild(td_duracao);

        const td_genero = document.createElement('td');
        td_genero.textContent = filme.genero;
        td_genero.classList.add('text-center');
        tr.appendChild(td_genero);

        const td_anoLanc = document.createElement('td');
        td_anoLanc.textContent = filme.ano_lancamento;
        tr.appendChild(td_anoLanc);

        const td_enredo = document.createElement('td');
        td_enredo.textContent = filme.enredo;
        tr.appendChild(td_enredo);

        const td_img = document.createElement('td');
        if (filme.img_filme) {
            const img = document.createElement('img');
            img.src = filme.img_filme;
            img.alt = filme.nome;
            img.width = 100; // Definindo o tamanho da imagem
            td_img.appendChild(img);
        }
        tr.appendChild(td_img);

        const td_acao = document.createElement('td');
        let btnEditar = document.createElement('a');
        btnEditar.classList.add('btn', 'btn-warning', 'me-3');
        btnEditar.href = `editarFilme.html?id=${filme.id}`; 
        btnEditar.textContent = 'EDITAR';
        td_acao.appendChild(btnEditar);

        let btnExcluir = document.createElement('button');
        btnExcluir.classList.add('btn', 'btn-danger', 'me-3');
        btnExcluir.textContent = 'EXCLUIR';
        btnExcluir.dataset.id = filme.id; 
        btnExcluir.dataset.name = filme.nome; 
        td_acao.appendChild(btnExcluir);
        td_acao.classList.add('text-center');

        tr.appendChild(td_acao);

        listaFilmes.appendChild(tr);
    });
};

const delFilme = async (id) => {
    await fetch(`/api/paginas/${id}`, {
        method: 'DELETE',
    });

    alert("Filme excluído com Sucesso!!");

    window.location.href = 'listarFilmes.html';
}

document.addEventListener('click', (e) => {
    let result = e.target.classList.contains('btn-danger');
    if (result) {
       const id_ex = e.target.getAttribute('data-id');
       const nome_ex = e.target.getAttribute('data-name');
       let ok = confirm(`Tem certeza que deseja excluir o filme: ${nome_ex}?`);
       if (ok) {
        delFilme(id_ex);
       } else {
        window.location.href = 'listarFilmes.html';
       }      
    }
    
});