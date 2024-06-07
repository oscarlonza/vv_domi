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
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }, 'Correo electrónico inválido');


function extendSchema (schema, definition, options) {
    return new Schema(
      Object.assign({}, schema.obj, definition),
      options
    );
  }

const userPasswordValidationSchema = extendSchema(userSchema);

const messagePasswordValidation = 'La contraseña debe tener como mínimo una letra mayúscula, una minúscula, un numero, un carácter especial  # $ % &, no se permiten espacios en blanco, y debe tener como mínimo 8 caracteres y máximo 15 caracteres.';

userPasswordValidationSchema.path('password')
.validate(async (password) => {
    return validarPassword(password);
}, messagePasswordValidation);

function validarPassword(password){
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$%&])[^\s]{8,15}$/;
    return passwordRegex.test(password);
}

const changePasswordSchema = new Schema({
    
    oldPassword: {
        type: String,
        required: [true, 'Contraseña actual requerida'],
    },
    newPassword: {
        type: String,
        required: [true, 'Contraseña nueva requerida'],
    }
});

changePasswordSchema.path('oldPassword')
.validate(async (oldPassword) => {
    return validarPassword(oldPassword);
}, messagePasswordValidation);



export const User = model('User', userSchema);
export const UserPassword = model('UserPassword', userPasswordValidationSchema);
export const ChangePassword = model('ChangePassword', changePasswordSchema);


