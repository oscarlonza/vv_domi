
import { Order } from '../models/order.js';
import { Product } from '../models/product.js';
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || products.length === 0)
            throw new Error('La orden debe tener productos');

        const n = products.length;
        let orderSaved = {};

        const session = await mongoose.startSession();

        session.startTransaction();
        
        try {

            for (let i = 0; i < n; i++) {
                const product = products[i];

                if (!product.id || !product.price)
                    throw new Error(`products[${i}]: el producto debe tener id, quantity y price`);
                if (!product.quantity || product.quantity < 1)
                    throw new Error(`products[${i}].quantity: La cantidad no puede ser menor a 1`);
                if (!product.price || product.price < 0)
                    throw new Error(`products[${i}].price: El precio no puede ser menor a 0`);

                const productFound = await Product.findById(product.id).session(session);

                if (!productFound)
                    throw new Error(`products[${i}]: Producto no encontrado`);
                if (product.quantity > productFound.quantity)
                    throw new Error(`products[${i}].quantity: Producto sin stock suficiente`);
                if (product.price !== productFound.price)
                    throw new Error(`products[${i}].price: Precio del producto incorrecto`);

                product.product = productFound._id;
                product.name = productFound.name;
                productFound.quantity -= product.quantity;
                await productFound.save({ session });
            }

            const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0);

            const order = new Order({ user: req.user.id, address: req.user.address, products, total });
            orderSaved = await order.save({ session });

            await session.commitTransaction();
            await session.endSession();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        }

        return res.status(201).json(orderSaved.toJSON());
    } catch (error) {
        return res.status(400).json({ message: error.message.replace('Order validation failed: ', '') });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id });

        res.json(orders.map(order => order.toJSON()));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
