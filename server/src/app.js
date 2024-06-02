import express from 'express'
import router from './routes/user-route.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use('/api', router)

export default app