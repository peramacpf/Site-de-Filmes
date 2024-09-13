/* Middleware para verificar se o usuário está logado/autenticado no sistema  */
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('login.html'); //redirecionamento para tela de login
    }
}

module.exports = {isAuthenticated};