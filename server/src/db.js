import mongoose from 'mongoose'

const db = async () => {
    await mongoose.connect(process.env.MONGODB);
    console.log('<<<< DB is Connected >>>>');
}

export default db;