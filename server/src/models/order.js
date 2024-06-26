
import mongoose from "mongoose";

export const OrderStatusEnum = ['created', 'preparing', 'delivered', 'received', 'canceled', 'rejected'];

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Usuario requerido'],
    },
    userName: {
        type: String,
        required: [true, 'Nombre del usuario requido'],
    },
    address: {
        type: String,
        required: [true, 'Dirección requerida'],
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Producto requerido'],
        },
        name: {
            type: String,
            required: [true, 'Nombre requerido'],
        },
        description: {
            type: String
        },
        quantity: {
            type: Number,
            required: [true, 'Cantidad requerida'],
            min: [1, 'La cantidad no puede ser menor a 1'],
        },
        price: {
            type: Number,
            required: [true, 'Precio requerido'],
            min: [0, 'El precio no puede ser menor a 1'],
        },
        image: {
            type: String,
            required: [true, 'Imagen requerida'],
        },
    }],
    total: {
        type: Number,
        required: [true, 'Total requerido'],
        min: [0, 'El total no puede ser menor a 1'],
    },
    status: {
        type: String,
        required: [true, 'Estado requerido'],
        enum: OrderStatusEnum,
        default: 'created',
    },
    receivedAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

orderSchema.methods.toJSON = function () {
    const { __v, createdAt, updatedAt, _id: id, products, ...data } = this.toObject();
    return { id, createdAt, products: products.map(({ _id, ...item }) => ({ ...item })), ...data };
};

orderSchema.methods.toResumeJSON = function () {
    const { __v, createdAt, updatedAt, _id: id, products, ...data } = this.toObject();
    return { id, createdAt, ...data };
};

export const Order = mongoose.model('Order', orderSchema);