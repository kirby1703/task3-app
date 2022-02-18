const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('./config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, { expiresIn: "1h"})
}

class authController{
    async registration(req, res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: `An error occurred while registration: ${errors}`})
            }
            const {username, password} = req.body;
            const candidate = await User.findOne({username})

            if (candidate) {
                return res.status(400).json({message:`The username ${username} has been already taken.`});
            }

            const hashPassword = await bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: 'USER'})
            const user = new User({username, password: hashPassword, roles: [userRole.value]});
            await user.save();
            return res.json({message: `The user has been successfully created`})

        } catch (error) {
            console.log(error);
            res.status(400).json({message:`An error has occured while registration: ${error}`});
        }
    }
    
    async login(req, res){
        try {
            const {username, password} = req.body;
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message:`Username is not found`});
            }
            const validPassword = await bcrypt.compareSync(password, user.password)
            if (!validPassword){
                return res.status(400).json({message:`Incorrect password`});
            }
            const token = generateAccessToken(user._id, user.roles);
            return res.json({token})

        } catch (error) {
            console.log(error);
            res.status(400).json({message:`An error has occured while login: ${error}`});
        }
    }

    async getUsers(req, res){
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            console.log(error);
            res.status(400).json({message:`An error has occured: ${error}`});
        }
    }
}

module.exports = new authController();