module.exports = function (req, res, next) {
    res.locals.isAuth = req.session.isAuthenticated
    res.locals.csrf = req.csrfToken()
    res.locals.page = req.query.page
    res.locals.limit = req.query.limit
    res.locals.active = req.query.active
    res.locals.sort = req.query.sort
    //console.log(req.csrfToken())
    // console.log(req.session)
    next()
}