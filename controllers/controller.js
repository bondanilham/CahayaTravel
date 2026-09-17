const { Op } = require("sequelize");
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
            let property = {
                include: [
                    {
                        model: VehicleType
                    }
                ],
                where: {},

            }
            // console.log(+penumpang);
            penumpang = +penumpang

            if (keberangkatan) {
                property.where.keberangkatan = {[Op.iLike]:`%${keberangkatan}%`}
            }
            if (destinasi) {
                property.where.destinasi = {[Op.iLike]:`%${destinasi}%`}
            }
            if (penumpang) {
                property.where[Op.and] = sequelize.literal(
                    `"totalSeats" - "filledSeats" >= ${penumpang}`
                )
            }
            let armada = await Armada.findAll(property)
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
            const {jumlahPenumpang} = req.body
            // console.log(req.body);
            let armada = await Armada.findByPk(id)
            armada.filledSeats += Number(jumlahPenumpang);
            await armada.save();

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
                }
            })

            res.render('transaction',{sesi, record})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async getProfile(req, res){
        try {
            let sesi = req.session.user
            // const {id} = req.params
            const {error, success} = req.query
            let dataProfile = await Profile.findOne({
                include: [{
                    model: User,
                    attributes: ['email']
                }],
                where: {
                    UserId: sesi.id
                }
            })
            console.log(req.session);
            console.log(dataProfile);
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

    static async deleteArmada(req,res){
        try {
            const {id} = req.params
            await Armada.destroy({where: {id: {[Op.eq]: id}}})
        } catch (error) {
            
        }
    }
}

module.exports = Controller