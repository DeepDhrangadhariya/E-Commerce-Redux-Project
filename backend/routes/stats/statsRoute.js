const express = require("express");
const routes = express.Router();
const statsCtrl = require('../../controller/stats/statsCtrl')

routes.get('/user-stats/:email', statsCtrl.userStatsByEmail)
routes.get('/admin-stats', statsCtrl.adminStats)

module.exports = routes