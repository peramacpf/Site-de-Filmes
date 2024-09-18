function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        } else {
            res.redirect('login.html');
        }
    }
}

module.exports = { isAuthenticated };
