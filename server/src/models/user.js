import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Nombre requerido'],
        minLength: [5, 'El nombre debe tener al menos 3 caracteres'],
        maxLength: [50, 'El nombre debe tener menos de 50 caracteres'],

    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Correo electrónico requerido']
    },
    password: {
        type: String,
        required: [true, 'Contraseña requerida'],
    },
    address: {
        type: String,
        trim: true,
        required: [true, 'Dirección requerida'],
        minLength: [10, 'La dirección debe tener al menos 10 caracteres'],
        maxLength: [50, 'La dirección debe tener menos de 100 caracteres']
    },
    role: {
        type: String,
        default: 'client',
        enum: ['client', 'superadmin']
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    verification_code: {
        type: String,
        require: false,
        length: 6
    }
}, { timestamps: true });

userSchema.path('email')
    .validate(async (email) => {
        console.log("Testing email >> ", email);
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }, 'Correo electrónico inválido');

export default model('User', userSchema);