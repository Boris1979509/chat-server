const auth = require('../external-services/firebase/auth')

const authMiddleware = async (req, res, next) => {
    try {
        // Bearer token
        const { authorization = '' } = req.headers
        const [, token] = authorization.split(' ') // split(' ')[1]
        const credential = await auth.verifyToken(token) // return user data
        req.locals = { email: credential.email }
        return next()
    } catch (error) {
        return res.status(401).send(error)
    }
}

module.exports = authMiddleware
