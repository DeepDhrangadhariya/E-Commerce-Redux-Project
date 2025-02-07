const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    profileImage: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: 200
    },
    profession: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// hashing passwords
userSchema.pre('save', async function(next) {
    const user = this
    if(!user.isModified('password')) return next()
    const hashedPassword = await bcrypt.hash(user.password, 10)
    user.password = hashedPassword
    next()
})

// Match Passwords
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

const userTable = new mongoose.model("user", userSchema)

module.exports = userTable