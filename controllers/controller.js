const { Op } = require("sequelize");
const QRCode = require("qrcode")
const {Armada, VehicleType, User, Profile, Transaction, sequelize} = require("../models/index");
const formatRupiah = require("../helpers/helper");

class Controller{
    static async home(req, res){
        try {
            let sesi = req.session.user
            const allArmada = await Armada.findAll()
            // console.log(allArmada);
            res.render('home', {allArmada, sesi})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async findArmada(req, res){
        try {
            let sesi = req.session.user
            // console.log(sesi);
            let {keberangkatan, destinasi, penumpang} = req.query
            // let property = {
            //     include: [
            //         {
            //             model: VehicleType
            //         }
            //     ],
            //     where: {},

            // }
            // // console.log(+penumpang);
            // penumpang = +penumpang

            // if (keberangkatan) {
            //     property.where.keberangkatan = {[Op.iLike]:`%${keberangkatan}%`}
            // }
            // if (destinasi) {
            //     property.where.destinasi = {[Op.iLike]:`%${destinasi}%`}
            // }
            // if (penumpang) {
            //     property.where[Op.and] = sequelize.literal(
            //         `"totalSeats" - "filledSeats" >= ${penumpang}`
            //     )
            // }
            let armada = await Armada.search({keberangkatan,destinasi, penumpang})
            res.render('findArmada', {armada, keberangkatan, destinasi, penumpang, formatRupiah, sesi})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    
    static async beliTiket(req, res){
        try {
            let sesi = req.session.user
            const {error, penumpang} = req.query
            const {id} = req.params
            let armada = await Armada.findOne({where: {id:{[Op.eq]:id}}})
            res.render('beliTiket', {id, armada, error, penumpang, sesi})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async postBeliTiket(req,res){
        const {id} = req.params
        try {
            let sesi = req.session.user
            const {jumlahPenumpang} = req.body
            // console.log(req.body);
            let armada = await Armada.findByPk(id)
            armada.filledSeats += Number(jumlahPenumpang);
            
            await armada.save();

            await Transaction.create({
                ArmadaId: armada.id,
                UserId: sesi.id,
                jumlahKursi: Number(jumlahPenumpang),
                totalHarga: armada.price * Number(jumlahPenumpang)
            })
            res.redirect('/transactionHistory')
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                error = error.errors.map(er=>er.message)
                return res.redirect(`/find-armada/beli/${id}?error=${error}`)
            }
            console.log(error);
            res.send(error)
        }
    }
    static async showTransaction(req,res){
        try {
            let sesi = req.session.user
            const record = await Transaction.findAll({
                where:{
                    UserId: {
                        [Op.eq]: sesi.id
                    }
                },
                include: [
                    {   
                        model: User,
                        include:[Profile]
                    },{
                        model: Armada
                    }
                ],
                order: [['createdAt', 'DESC']]
            })

            res.render('transaction',{sesi, record, formatRupiah})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async showPaymentPage(req, res){
        try {
            const sesi = req.session.user
            const {id} = req.params
            
            const transaction = await Transaction.findOne({
                where: {
                    id: {[Op.eq]: id},
                    UserId: {[Op.eq]: sesi.id}
                },
                include: [
                    {   
                        model: User,
                        include:[Profile]
                    },{
                        model: Armada
                    }
                ]
            })

            if (transaction.statusBayar) {
                return res.redirect('/transactionHistory')
            }

            const qr = await QRCode.toDataURL(
                `CAHAYA-TRAVEL
                ${transaction.Armada.keberangkatan} - ${transaction.Armada.destinasi}
                x${transaction.jumlahKursi} kursi|${formatRupiah(transaction.totalHarga)}`
            )

            res.render('payment', {transaction, sesi, qr, formatRupiah})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async payProcess(req, res){
        try {
            const sesi = req.session.user
            const {id} = req.params

            const transaction = await Transaction.findOne({
                where: {
                    id: {[Op.eq]: id},
                    UserId: {[Op.eq]: sesi.id}
                }
            })

            await transaction.update({statusBayar: true})
            res.redirect('/transactionHistory')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async cancelTransaction(req,res){
        try {
            const sesi = req.session.user
            const {id} = req.params

            const transaction = await Transaction.findOne({
                where: {
                    id: {[Op.eq]: id},
                    UserId: {[Op.eq]: sesi.id}
                },
                include: [Armada]
            })
            // transaction.Armada.filledSeats -= transaction.jumlahKursi
            let armada = transaction.Armada
            await armada.update({
                filledSeats: armada.filledSeats - transaction.jumlahKursi
            })
            await transaction.destroy()

            res.redirect('/transactionHistory')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async getProfile(req, res){
        try {
            let sesi = req.session.user
            const {id} = req.params
            const {error, success} = req.query
            let dataProfile = await Profile.findOne({
                include: [{
                    model: User,
                    attributes: ['email']
                }],
                where: {
                    UserId: id
                }
            })
            // console.log(req.session);
            // console.log(dataProfile);
            res.render('profile', {dataProfile, error, success, sesi})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async postProfile(req, res){
        const {id} = req.params
        try {
            const {nama, foto, ktp, phoneNumber, email} = req.body
            await Profile.update({nama, foto, ktp, phoneNumber}, {
                where: {
                    id: {
                    [Op.eq]: id
                }
                }
            })
            let profile = await Profile.findByPk(id)
            await User.update({email}, {where: 
                {id:  
                    profile.UserId
                }})
            res.redirect(`/profile/${id}?success=Berhasil Edit!`)
        } catch (error) {
            if(error.name === "SequelizeValidationError"){
                let messages = error.errors.map(el => {
                    return el.message
                })
                res.redirect(`/profile/${id}?error=${messages}`)
            }else{
                console.log(error);
                res.send(error)
            }
        }
    }

    static async profileList(req, res){
        try {
            let sesi = req.session.user

            const {hapus} = req.query
            let admin = await Profile.findAll({
                include: "User"
            })
            res.render('adminProfileList', {admin,hapus,sesi})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async deleteProfile(req, res){
        try {
            const {id} = req.params
            // console.log(req.params);
            let profileData = await Profile.findByPk(id)
            let nama = profileData.nama
            let user = profileData.UserId
            await Profile.destroy({where: {id:id}})
            await User.destroy({where:{id:user}})
            // await profileData.destroy()
            // await User.destroy({where: {
            //     id: {
            //         [Op.eq]: 
            //     }
            // }})
            res.redirect(`/profile/list?hapus=${nama}`)
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async addArmadaForm(req, res){
        try {
            let sesi = req.session.user
            const {error} = req.query
            const vehicleTypes = await VehicleType.findAll()
            res.render('addArmada', {sesi, vehicleTypes, error})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async postAddArmada(req, res){
        try {
            const {keberangkatan, destinasi, price, totalSeats, VehicleTypeId} = req.body

            await Armada.create({
                keberangkatan,
                destinasi,
                price: Number(price),
                totalSeats: Number(totalSeats),
                VehicleTypeId: Number(VehicleTypeId)
            })

            res.redirect('/find-armada')
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                let messages = error.errors.map(el => el.message)
                return res.redirect(`/armada/add?error=${messages}`)
            }
            console.log(error);
            res.send(error)
        }
    }
    
    static async deleteArmada(req,res){
        try {
            const {id} = req.params
            const {keberangkatan, destinasi, penumpang} = req.query
            await Armada.destroy({where: {id: {[Op.eq]: id}}})
            res.redirect('/find-armada')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
}

module.exports = Controller