import jwt from 'jsonwebtoken'
import {config} from 'dotenv'
config()

const validateToken = (req, res, next) => {
    const {token} = req.cookies
    const KEY = process.env.TOKEN_SECRET
    if (!token) 
        return res.status(401).json({message: 'No hay token, Autorizacion denegada'})
    jwt.verify(
        token, 
        KEY, (err, user) => {
            if (err) return res.status(401).json({message: 'token invalido'})
            req.user = user
            next()
        }
    )
}

export default validateToken