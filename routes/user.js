const userController = require('../controllers/userController')
const router = require('express').Router()

router.get('/login', userController.login)
router.post('/login', userController.loginPost)
router.get('/register', userController.register)
router.post('/register', userController.postRegister)
router.get('/logout', userController.logout)


module.exports = router