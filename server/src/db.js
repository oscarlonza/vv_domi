import mongoose from 'mongoose'

const db = async () => {
    await mongoose.connect('mongodb+srv://josearom66:Juan2000Jose.1@cluster0.pvzrn75.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/merndb')
    console.log('<<<< DB is Connected >>>>')
}

export default db