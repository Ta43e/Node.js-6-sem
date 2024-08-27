module.exports.login = function(req, res, next) {
    if (req.session.logout && req.headers.authorization) {
        req.session.logout = false;
        delete req.headers.authorization;
    }
    next();
}

module.exports.logout = function(req, res, next) {
    req.session.logout = true;
    res.redirect('/login');
}

module.exports.resource = function(req, res, next) {
    res.send("resource")
}