import jwt from 'jsonwebtoken'
import {config} from 'dotenv'
config()

function createAccessToken (payload) {
    const KEY = process.env.TOKEN_SECRET
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            KEY,
        {
            expiresIn: '1d'
        }, (err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token)
        }
        )
    })
}

export default createAccessToken