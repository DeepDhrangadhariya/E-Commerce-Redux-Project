const express = require('express')
const routes = express.Router()
const userCtrl = require('../../controller/user/userCtrl')
const { verifyToken } = require('../../middleware/verifyToken')

routes.get('/getusers', userCtrl.getAllUsers)

routes.post('/register', userCtrl.register)
routes.post('/login', userCtrl.login)
routes.post('/logout', userCtrl.logout)

routes.put('/users/:id', userCtrl.updateRole)

routes.patch('/edit-profile', userCtrl.editProfile)

routes.delete('/users/:id', userCtrl.deleteUser)

module.exports = routes