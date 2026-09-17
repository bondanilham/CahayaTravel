const express = require('express');
const router = express.Router()

const routerArmada = require('./armada');
const routerUser = require('./user');
const Controller = require('../controllers/controller');

router.use('/user', routerUser)
router.use('/',routerArmada)

module.exports = router