/*
Esquema para calificar un producto, el cual se compone de un comentario y 
una calificación (valor entero positivo entre 1 y 5)
*/
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'Comentario requerido'],
        maxlength: [250, 'El comentario debe tener máximo 250 caracteres'],
    },
    rating: {
        type: Number,
        required: [true, 'Calificación requerida'],
        min: [1, 'La calificación no puede ser menor a 1'],
        max: [5, 'La calificación no puede ser mayor a 5'],
    },
    user: {
        type: String,
        required: [true, 'Usuario requerido'],
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,    
    },
}, { timestamps: true });

commentSchema.methods.toJSON = function () {
    const { __v, createdAt, updatedAt, _id, product, ...data } = this.toObject();
    return { ...data };
};

export const Comment = mongoose.model('Comment', commentSchema);