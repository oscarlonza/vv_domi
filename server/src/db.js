import mongoose from 'mongoose'
import { User } from './models/user.js';
import bcrypt from 'bcryptjs';

const db = async () => {
    await mongoose.connect(process.env.MONGODB);
    console.log('<<<< DB is Connected >>>>');

    createSuperAdmin();

}

const createSuperAdmin = async () => {
    const userAdmin = await User.findOne({ name: 'Super Admin' });
    if (userAdmin) return;

    console.log('Creating the first user (superadmin)');
    const newUser = new User({
        name: 'Super Admin',
        email: process.env.ADMIN_EMAIL || 'admin@email.com',
        address: 'Admin Address',
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin', 10),
        role: 'superadmin',
        is_verified: true
    });

    let userSaved = await newUser.save();

    if (!userSaved)
        console.log('Error creating the first user (superadmin)');
    else
        console.log('The first user (superadmin) was created successfully');
}

export default db;