
import { Order } from '../models/order.js';
import { Product } from '../models/product.js';
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || products.length === 0)
            throw new Error('La orden debe tener productos');

        const n = products.length;

        const session = await mongoose.startSession();

        session.startTransaction();


        //let orderSaved = null;
        //let productsFound = [];
        for (let i = 0; i < n; i++) {
            const product = products[i];

            if (!product.id || !product.price)
                throw new Error(`products[${i}]: el producto debe tener id, quantity y price`);
            if (!product.quantity || product.quantity < 1)
                throw new Error(`products[${i}].quantity: La cantidad no puede ser menor a 1`);
            if (!product.price || product.price < 0)
                throw new Error(`products[${i}].price: El precio no puede ser menor a 0`);

            const productFound = await Product.findById(product.id);

            if (!productFound)
                throw new Error(`products[${i}]: Producto no encontrado`);
            if (product.quantity > productFound.quantity)
                throw new Error(`products[${i}].quantity: Producto sin stock suficiente`);
            if (product.price !== productFound.price)
                throw new Error(`products[${i}].price: Precio del producto incorrecto`);

            product.product = productFound._id;
            product.name = productFound.name;
            productFound.quantity -= product.quantity;
            //productsFound.push(productFound);
            await productFound.save({session});
            //Product.updateOne({ _id: productFound._id }, { quantity: productFound.quantity - product.quantity }, { session });
        }

        //productsFound.map(async product => await product.save());

        //const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0);

        const order = new Order({ user: req.user.id, address: req.user.address, products, total });
        orderSaved = await order.save({ session });

        throw new Error('Error de prueba');
        //const orderSaved = await Order.create([{ user: req.user.id, address: req.user.address, products, total }], { session });

        res.status(201).json(orderSaved.toJSON());
    } catch (error) {
        res.status(400).json({ message: error.message.replace('Order validation failed: ', '') });
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
