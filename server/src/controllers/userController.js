import User from '../models/user-schema.js'
import createAccessToken from '../libs/jwt.js'
import bcrypt from 'bcryptjs'

export async function registerController (req, res) {
    const {username, email, password} = req.body
    console.log(username, email, password)
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = new User({
            username,
            email,
            password: passwordHash
        })

        const userSaved = await newUser.save()

        const token = await createAccessToken({id: userSaved._id})

        res.cookie('token', token)
    
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt
        })

    } catch (error) {
        res.status(500).json({message: error.message})
    }
    
}

export async function loginController (req, res) {
    const {email, password} = req.body
    try {
        const userFound = await User.findOne({email})
        if (!userFound) return res.status(400).json({message: 'Email not found'})
        const passwordGood = await bcrypt.compare(password, userFound.password)
        if (!passwordGood) return res.status(400).json({message: 'password incorrect'})

        const token = await createAccessToken({id: userFound._id})

        res.cookie('token', token)
    
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export function logoutController (req, res) {
    res.cookie('token', '', {expires: new Date(0)})
    res.sendStatus(200)
}

export async function profileController (req, res) {
    const userFound = await User.findById(req.user.id)
    if (!userFound)
        return res.state(404).json({message: 'Usuario no encontrado'})

    return res.send({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt

    })
}