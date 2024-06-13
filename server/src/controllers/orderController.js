
import { Order, OrderStatusEnum } from '../models/order.js';
import { Product } from '../models/product.js';
import mongoose from "mongoose";


const validateProduct = async (i, product, session) => {
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

    return productFound;
};

export const createOrderTransaction = async (req, products) => {

    if (!products || products.length === 0)
        throw new Error('La orden debe tener productos');

    const n = products.length;
    let orderSaved = {};

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        for (let i = 0; i < n; i++) {
            const product = products[i];

            const productFound = await validateProduct(i, product, session);

            product.product = productFound._id;
            product.name = productFound.name;
            product.image = productFound.image;
            product.description = productFound.description;
            productFound.quantity -= product.quantity;
            await productFound.save({ session });
        }

        const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0);

        const order = new Order({ user: req.user.id, userName: req.user.name, address: req.user.address, products, total });
        orderSaved = await order.save({ session });
        orderSaved = orderSaved.toJSON();

        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    }

    return orderSaved;
};

export const createOrder = async (req, res) => {
    try {
        const { products } = req.body;

        const orderSaved = await createOrderTransaction(req, products);

        return res.status(201).json(orderSaved);
    } catch (error) {
        return res.status(400).json({ message: error.message.replace('Order validation failed: ', '') });
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

export const getOrders = async (req, res) => {
    try {

        const { role } = req.user;

        const orders = await Order
            .find(role === 'superadmin' ? {} : { user: req.user.id })
            .sort({ createdAt: "desc" });

        res.json(orders.map(order => order.toJSON()));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getOrdersBetweenDates = async (req, res) => {
    try {

        const { from, to } = req.query;

        if (!from || !to)
            throw new Error('from: Fecha desde requerida, to: Fecha hasta requirida');

        let fromDate = new Date(`${from}T00:00:00.000Z`);
        let toDate = new Date(`${to}T23:59:59.000Z`);

        const orders = await Order
            .find({
                createdAt: {
                    $gte: fromDate,
                    $lte: toDate
                }
            })
            .sort({ createdAt: "desc" });

        res.json(orders.map(order => order.toResumeJSON()));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTopTenProducts = async (req, res) => {
    try {

        const { from, to } = req.query;

        if (!from || !to)
            throw new Error('from: Fecha desde requerida, to: Fecha hasta requirida');

        let fromDate = new Date(`${from}T00:00:00.000Z`);
        let toDate = new Date(`${to}T23:59:59.000Z`);

        const orders = await Order
            .find({
                createdAt: {
                    $gte: fromDate,
                    $lte: toDate
                }
            })
            .sort({ createdAt: "desc" });

        const products = {};

        orders.forEach((order) => {
            order.products.forEach((product) => {
                if (!products[product.product]) {
                    products[product.product] = {
                        name: product.name,
                        description: product.description,
                        quantities: [product.quantity],
                        image: product.image
                    };
                } else {
                    products[product.product].quantities.push(product.quantity);
                }
            });
        });

        Object.values(products).forEach((prod) => {
            prod.quantity = prod.quantities.reduce((a, b) => a + b, 0);
            delete prod.quantities;
        });

        const uniqueProducts = Object.values(products)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10);

        res.json(uniqueProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrdersPerStatus = async (req, res) => {
    try {
        const { from, to } = req.query;

        if (!from || !to)
            throw new Error('from: Fecha desde requerida, to: Fecha hasta requirida');

        let fromDate = new Date(`${from}T00:00:00.000Z`);
        let toDate = new Date(`${to}T23:59:59.000Z`);

        const orders = await Order
            .find({
                createdAt: {
                    $gte: fromDate,
                    $lte: toDate
                }
            });
        
        const enableStatus = OrderStatusEnum.filter(status => status !== 'canceled');

        const orderPerStatus = {};

        enableStatus.forEach((status) => {
            orderPerStatus[status] = orders.filter(order => order.status === status).length;
        });

        return res.status(200).json(orderPerStatus);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getPaginatedProductsPurchasedByUser = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { page, limit, filter } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;

        const orders = await Order
            .find({ user: userId })
            .sort({ createdAt: "desc" });

        const products = {};

        const filterValue = (filter || '').toLowerCase();

        orders.forEach((order) => {
            order.products.forEach((product) => {
                if (product.name.toLowerCase().includes(filterValue) || (product.description != null && product.description.toLowerCase().includes(filterValue))) {
                    if (!products[product.product]) {
                        products[product.product] = {
                            name: product.name,
                            description: product.description,
                            prices: [product.price * product.quantity],
                            quantities: [product.quantity],
                            image: product.image
                        };
                    } else {
                        products[product.product].prices.push(product.price * product.quantity);
                        products[product.product].quantities.push(product.quantity);
                    }
                }
            });
        });

        Object.values(products).forEach((prod) => {
            prod.quantity = prod.quantities.reduce((a, b) => a + b, 0);
            prod.average_price = prod.prices.reduce((a, b) => a + b, 0) / (prod.quantity);
            delete prod.prices;
            delete prod.quantities;
        });

        const uniqueProducts = Object.values(products);

        const totalProducts = uniqueProducts.length;
        const totalPages = Math.ceil(totalProducts / limitNumber);

        const startIndex = (pageNumber - 1) * limitNumber;
        const endIndex = startIndex + limitNumber;
        const paginatedProducts = uniqueProducts.slice(startIndex, endIndex);

        return res.status(200).json({
            page: pageNumber,
            limit: limitNumber,
            totalPages: totalPages,
            totalProducts: totalProducts,
            products: paginatedProducts
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

export const rejectOrCancelOrderTransaction = async (orderFound, status) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        const { products } = orderFound;

        for (const product of products) {
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
};

