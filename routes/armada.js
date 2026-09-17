const Controller = require('../controllers/controller')
const router = require('express').Router()
const session = require('express-session')

router.get('/', Controller.home)
router.get('/find-armada', Controller.findArmada)


//di sini cek user udah login dan isi profile belum

const middleware = function (req, res, next) {
    // console.log(req.session)
    // console.log('masuk sini');
    if(!req.session.user) {
        res.redirect(`/user/login?error=Please login first`)
    }else{
        next()
    }
}

router.get('/find-armada/beli/:id', middleware, Controller.beliTiket)
router.post('/find-armada/beli/:id', middleware, Controller.postBeliTiket)
router.get('/transactionHistory', middleware, Controller.showTransaction)
router.get('/transactionHistory/:id/payment', middleware, Controller.showPaymentPage)
router.post('/transactionHistory/:id/payment', middleware, Controller.payProcess)
router.post('/transactionHistory/:id/cancel', middleware, Controller.cancelTransaction)
router.get('/profile/list', middleware, Controller.profileList)
router.get('/profile/:id', middleware, Controller.getProfile)
router.post('/profile/:id', middleware, Controller.postProfile)
router.get('/profile/:id/delete', middleware, Controller.deleteProfile)
router.get('/delete-armada/:id', middleware, Controller.deleteArmada)

module.exports = router