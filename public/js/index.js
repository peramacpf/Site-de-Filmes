const listarFilmes = document.getElementById("listarFilmes");
const loader = document.createElement('div');
loader.textContent = "Carregando filmes...";
listarFilmes.appendChild(loader);

document.addEventListener("DOMContentLoaded", async () => {
    await carregarFilmes();
});

const carregarFilmes = async (query = '') => {
    try {
        const response = await fetch(`/api/paginas/?search=${query}`);
        if (!response.ok) {
            throw new Error("Erro ao carregar filmes.");
        }
        const filmes = await response.json();
        mostrarFilmes(filmes);
    } catch (error) {
        listarFilmes.innerHTML = `<p class="text-danger">Erro: ${error.message}</p>`;
    } finally {
        loader.remove();
    }
};

const mostrarFilmes = (filmes) => {
    listarFilmes.innerHTML = '';

    filmes.forEach(filme => {
        let col = document.createElement('div');
        col.classList.add('col');

        let card = document.createElement('div');
        card.classList.add('card', 'border-secondary');
        card.style.width = '16rem';
        col.appendChild(card);

        let img = document.createElement('img');
        img.src = filme.img_filme || 'path/to/default/image.jpg';
        img.classList.add('card-img-top', 'img-fluid', 'img-thumbnail');
        img.alt = filme.nome;
        card.appendChild(img);

        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'text-secondary');
        card.appendChild(cardBody);

        let h5 = document.createElement('h5');
        h5.classList.add('card-title');
        h5.textContent = filme.nome;
        cardBody.appendChild(h5);

        let diretor = document.createElement('p');
        diretor.classList.add('card-text');
        diretor.innerHTML = `<strong>Diretor:</strong> ${filme.diretor}`;
        cardBody.appendChild(diretor);

        let duracao = document.createElement('p');
        duracao.classList.add('card-text');
        duracao.innerHTML = `<strong>Duração:</strong> ${filme.duracao} minutos`;
        cardBody.appendChild(duracao);

        let genero = document.createElement('p');
        genero.classList.add('card-text');
        genero.innerHTML = `<strong>Gênero:</strong> ${filme.genero}`;
        cardBody.appendChild(genero);

        let ano_lancamento = document.createElement('p');
        ano_lancamento.classList.add('card-text');
        ano_lancamento.innerHTML = `<strong>Ano de Lançamento:</strong> ${filme.ano_lancamento}`;
        cardBody.appendChild(ano_lancamento);

        let enredo = document.createElement('p');
        enredo.classList.add('card-text');
        enredo.innerHTML = `<strong>Enredo:</strong> ${filme.enredo}`;
        cardBody.appendChild(enredo);

        let divButtonGroup = document.createElement('div');
        divButtonGroup.classList.add('button-group');
        cardBody.appendChild(divButtonGroup);

        listarFilmes.appendChild(col);
    });
};

const searchInput = document.querySelector('input[type="search"]');
searchInput.addEventListener('input', (event) => {
    const query = event.target.value.trim();
    carregarFilmes(query);
});