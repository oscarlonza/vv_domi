
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
                product.image = productFound.image;
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

        const { role } = req.user;

        const orders = await Order.find(role === 'superadmin' ? {} : { user: req.user.id });

        res.json(orders.map(order => order.toJSON()));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateOrder = async (req, res) => {

    try {
        const { id } = req.params;
        const { status } = req.body;
        const { id: userId, role } = req.user;

        if (!status)
            throw new Error('status: Estado es requiredo');

        const filter = { _id: id };
        const isAdmin = role === 'superadmin';
        if (!isAdmin) filter.user = userId;

        const orderFound = await Order.findOne(filter);

        if (!orderFound)
            throw new Error('Orden no encontrada');

        const { status: orderStatus } = orderFound;

        validateAvailableStatus(isAdmin, orderStatus, status);

        if (['canceled', 'rejected'].includes(status)) {

            await rejectOrCancelOrderTransaction(orderFound, status);
        }
        else {
            orderFound.status = status;
            await orderFound.save();
        }

        return res.status(200).json({ message: 'Estado actualizado satisfactoriamente' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getPaginatedProductsPurchasedPerUser = async (req, res) => {
    try {
        const { id: userId } = req.user.id;
        const { page, limit, filter } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;

        const orders = (await Order.find({ user: userId }));

        

        /*
        
                const regexValue = filter || '';
                const findParameters = {
                    $or: [
                        { name: { $regex: regexValue, $options: 'i' } },
                        { description: { $regex: regexValue, $options: 'i' } }
                    ],
                    quantity: { $gt: 0 }
                };
        
                const totalProducts = await Product
                    .countDocuments(findParameters);
        
                const totalPages = Math.ceil(totalProducts / limitNumber);
        
                const products = await Product
                    .find(findParameters)
                    .skip((pageNumber - 1) * limitNumber)
                    .limit(limitNumber);
        */

        return res.json(orders);

        return res.status(200).json({
            page: pageNumber,
            limit: limitNumber,
            totalPages: totalPages,
            totalProducts: totalProducts,
            products: products.map(product => product.toJSON())
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const validateAvailableStatus = (isAdmin, orderStatus, status) => {
    let availableStates = [];

    if (!isAdmin) {

        switch (orderStatus) {
            case 'created':
            case 'preparing':
                availableStates = ['canceled'];
                break;
            case 'delivered':
                availableStates = ['received'];
        }
    }
    else {

        switch (orderStatus) {
            case 'created':
                availableStates = ['preparing', 'rejected'];
                break;
            case 'preparing':
                availableStates = ['delivered'];
                break;
            case 'delivered':
                availableStates = ['preparing'];
        }
    }

    if (!availableStates.includes(status))
        throw new Error('status: Estado no disponible');
};

const rejectOrCancelOrderTransaction = async (orderFound, status) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        const { products } = orderFound;

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const productFound = await Product.findById(product.product);
            productFound.quantity += product.quantity;
            await productFound.save({ session });
        }

        orderFound.status = status;
        await orderFound.save({ session });

        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
}