const generateToken = require('../../middleware/generateToken')
const userSchema = require('../../model/userSchema')

module.exports.register = async (req, res) => {
    try {
        const { userName, email, password } = req.body
        const user = new userSchema({ userName, email, password })
        await user.save()
        res.status(200).send({ message: "user Registration Successfully" })
    } catch (error) {
        console.error("Error At Registering User, ", error)
        res.status(500).send({ message: "Error registering user" })
    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userSchema.findOne({ email })
        if (!user) {
            return res.status(404).send({ message: "User Not Found" })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(401).send({ message: "Password Invalid" })
        }

        const token = await generateToken(user._id)

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        })

        res.status(200).send({
            message: "Login Successfully", token, user: {
                _id: user._id,
                email: user.email,
                userName: user.userName,
                role: user.role,
                profileImage: user.profileImage,
                bio: user.bio,
                profession: user.profession,
            }
        })
    } catch (error) {
        console.error("Error At Login User")
        res.status(500).send({ message: "Error At Login user" })
    }
}

module.exports.logout = (req, res) => {
    try {
        res.clearCookie('token')
        res.status(200).send({ message: "Loguot Successfully" })
    } catch (error) {
        console.error("Error At Logout, ", error)
        res.status(500).send({ message: "Error At Logout" })
    }
}

module.exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userSchema.findByIdAndDelete(id)
        if (!user) {
            return res.status(500).send({ message: "User Not Found" })
        }

        res.status(200).send({ message: "User Deleted Successfully" })
    } catch (error) {
        console.error("Error Deleting User, ", error)
        res.status(500).send({ message: "Error Deleting User" })
    }
}

module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await userSchema.find({}, 'id email role').sort({ createdAt: -1 })
        res.status(200).send({ message: "Users Found", users })
    } catch (error) {
        console.error("Error Geting All Users, ", error)
        res.status(500).send({ message: "Error Geting All Users" })
    }
}

module.exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.body
        const user = await userSchema.findByIdAndUpdate(id, { role }, { new: true })

        if (!user) {
            return res.status(404).send({ message: "User Not Found" })
        }

        res.status(200).send({ message: 'User Role Updated Successfully', user })
    } catch (error) {
        console.error("Error Updating User Role, ", error)
        res.status(500).send({ message: "Error Updating User Role" })
    }
}

module.exports.editProfile = async (req, res) => {
    try {
        const { userId, userName, profileImage, bio, profession } = req.body
        if (!userId) {
            return res.status(400).send({ message: "User Id Is Required" })
        }

        const user = await userSchema.findById(userId)

        if (!user) {
            return res.status(404).send({ message: "User Not Found" })
        }

        if (userName !== undefined) user.userName = userName
        if (profileImage !== undefined) user.profileImage = profileImage
        if (bio !== undefined) user.bio = bio
        if (profession !== undefined) user.profession = profession

        await user.save()
        res.status(200).send({
            message: "User Profile Updated Successfully", user: {
                _id: user._id,
                email: user.email,
                userName: user.userName,
                role: user.role,
                profileImage: user.profileImage,
                bio: user.bio,
                profession: user.profession,
            }
        })
    } catch (error) {
        console.error("Error Updating User Profile, ", error)
        res.status(500).send({ message: "Error Updating User Profile" })
    }
}