const logout = document.getElementById('logout');

logout.addEventListener('click', async () => {

    const response = await fetch('api/auth/logout', {method: 'POST',});
    const result = await response.json();

    if (response.ok) {
        alert(result.message);
        window.location.href = '/pagina-inicial';
    } else {
        alert("Erro ao tentar fazer o logout");
    }

})