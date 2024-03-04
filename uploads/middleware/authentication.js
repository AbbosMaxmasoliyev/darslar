function authMiddleware(req, res, next) {
    let { token } = req.headers
    if (token) {
        next()
    } else {
        res.status(400).send("no")
    }
}


module.exports = { authMiddleware }