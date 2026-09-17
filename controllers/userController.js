const { User, Profile } = require("../models/index")
const bcryptjs = require("bcryptjs")

class userController{
    static async login(req, res){
        try {
            const {error} = req.query
            res.render('login', {error})
        } catch (error) {
            console.log(error);
            res.send(error)           
        }
    }

    static async loginPost(req, res){
        try {
            const {email, password} = req.body
            await User.findOne({
                where: {email}
            }).then(user =>{
                if(user){
                    const isValidPassword = bcryptjs.compareSync(password, user.password)

                    if(isValidPassword){
                        // console.log(user);
                        req.session.user = {id: user.id, role: user.role}
                        // console.log(req.session);
                        return res.redirect('/')
                    }else{
                        const error = "Invalid password."
                        return res.redirect(`/user/login?error=${error}`)
                    }
                }else{
                    const error = "Invalid email."
                    return res.redirect(`/user/login?error=${error}`)
                }
            })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async register(req, res){
        try {
            const {error} = req.query 
            res.render('register', {error})
        } catch (error) {
            console.log(error);
            res.send(error)            
        }
    }

    static async postRegister(req, res){
        try {
            const {email, password, role, nama, foto, ktp, phoneNumber} = req.body
            if(email && password && role && nama && foto && ktp && phoneNumber){
                await User.create({email, password, role})
            let newUser = await User.findOne({
                where: {
                    email: email
                }
            })
                await Profile.create({nama, foto, ktp, phoneNumber, UserId : newUser.id})
                res.redirect('/user/login')
            }else{
                let err = "All fields must be filled."
                res.redirect(`/user/register?error=${err}`)
            }
                        
        } catch (error) {
            if(error.name === "SequelizeValidationError"){
                let messages = error.errors.map(el => {
                    return el.message
                })
                res.redirect(`/user/register?error=${messages}`)
            }else{
                console.log(error);
                res.send(error)
            }
        }
    }

    static async logout(req, res){
        try {
            req.session.destroy((err) => {
                if(err) console.log(err);
                else{
                    res.redirect('/user/login')
                }
            })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
}

module.exports = userController