import { model, Schema } from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        required: 'Nombre de usuario requerido'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        required: 'Correo electrónico requerido'
    },
    password: {
        type: String,
        required: true,
        required: 'Contraseña requerida'
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
});

export default model('User', userSchema);