const jwt = require('jsonwebtoken')
const userSchema = require('../model/userSchema')
const JWT_SECRET = process.env.JWT_SECRET_KEY

const generateToken = async (userId) => {
    try {
        const user = await userSchema.findById(userId)
        if (!user) {
            throw new Error('User Not Found')
        }

        const token = jwt.sign({userId: user._id, role: user.role}, JWT_SECRET, {expiresIn: '1h'})
        return token
    } catch (error) {
        console.error("Token Not Generated, ", error)
        res.status(401).send({message: "Token Not Generated"})
    }
}

module.exports = generateToken