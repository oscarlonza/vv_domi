import {model, Schema} from 'mongoose'

const newSchema = new Schema({
    username : {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
},{
    timestamps:true,
    versionKey: false
})

export default model('User', newSchema)