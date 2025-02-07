const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET_KEY

module.exports.verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).send({ message: 'Invalid Token'})
        }

        const decoded = jwt.verify(token, JWT_SECRET)
        if (!decoded) {
            return res.status(401).send({message: 'Token Not Matched'})
        }
        req.userId = decoded.userId
        req.role = decoded.role
        next()
    } catch (error) {
        console.error("Error At Verify Token, ", error)
        res.status(401).send({message: "Error At Verify Token"})
    }
}