const listarFilmes = document.getElementById("listarFilmes");

document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/api/paginas/");
    const filmes = await response.json();
});

