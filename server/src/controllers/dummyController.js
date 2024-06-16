
import { User } from '../models/user.js';
import { Product } from '../models/product.js';
import { Comment } from '../models/comment.js';
import { Order } from '../models/order.js';
import { addFileToRepository } from '../libs/fileManager.js';
import { createOrderTransaction, rejectOrCancelOrderTransaction } from './orderController.js';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

export const createDummyUsers = async (req, res) => {
    try {

        const { totalUsers } = req.body;
        const total = parseInt(totalUsers) || 10;
        let users = [];
        for (let i = 0; i < total; i++) {
            const name = faker.person.fullName();
            const email = faker.internet.email();
            const address = faker.location.streetAddress();
            const password = await bcrypt.hash('password', 10);
            const newUser = new User({ name, email, address, password, is_verified: true });
            await newUser.save();
            users.push(newUser.toJSON());
            console.log(`Usuario ${i + 1}/${totalUsers} creado correctamente`);
        }

        return res.status(201).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const importDummyProducts = async (req, res) => {
    try {

        fetch('https://dummyjson.com/products?limit=200&select=title,description,price,reviews,thumbnail')
            .then(response => response.json())
            .then(data => {
                const { products } = data;
                products.forEach(async (product) => {
                    const { title, description, price, reviews, thumbnail } = product;
                    const comments = reviews.map((review) => review.rating);
                    const newProduct = new Product({
                        name: title,
                        description : description.substr(0,200), 
                        price: (price * 1000),
                        quantity: faker.number.int({ min: 0, max: 50 }),
                        comments: comments,
                        image: thumbnail
                    });
                    const productSaved = await newProduct.save();
                    reviews.forEach(async (review) => {
                        const { rating, comment, reviewerName } = review;
                        const newComment = new Comment({
                            comment, rating,
                            user: reviewerName,
                            product: productSaved._id
                        });
                        await newComment.save();
                    });

                    console.log(`Producto ${title} creado correctamente`);
                });
                return res.status(201).json({message: 'Productos importados correctamente'});
            })
            .catch(error => {
                return res.status(500).json({ message: error.message });
            });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

export const createDummyProducts = async (req, res) => {
    try {
        const products = [];
        const { totalProducts } = req.body;
        const total = parseInt(totalProducts) || 200;

        for (let i = 0; i < total; i++) {
            const name = faker.commerce.productName();
            const price = faker.commerce.price();
            const description = faker.lorem.sentence();
            const quantity = faker.number.int({ min: 0, max: 50 });
            const image = addFileToRepository(req);
            const newProduct = new Product({ name, price, description, quantity, image });
            await newProduct.save();

            const nComments = faker.number.int({ min: 0, max: 50 });
            for (let j = 0; j < nComments; j++) {
                const comment = faker.lorem.sentence();
                const rating = faker.number.int({ min: 1, max: 5 });
                const newComment = new Comment({
                    comment, rating,
                    user: faker.internet.userName(),
                    product: newProduct._id
                });
                await newComment.save();
                newProduct.comments.push(newComment.rating);

                console.log(`Comentario ${j + 1}/${nComments} creado correctamente`);
            }

            const productSaved = await newProduct.save();

            products.push(productSaved.toJSON());

            console.log(`Producto ${i + 1}/${total} creado correctamente`);
        }

        return res.status(201).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createDummyOrders = async (req, res) => {
    try {
        const { totalOrders } = req.body;
        const total = parseInt(totalOrders) || 50;

        let orders = [];
        const users = await User.find({ role: 'client' });
        for (let i = 0; i < total; i++) {
            const productsDb = await Product.find({ quantity: { $gt: 0 } });
            const nProducts = faker.number.int({ min: 1, max: 5 });
            let products = [];
            const userDb = faker.helpers.arrayElement(users);
            req.user = { id: userDb._id, name: userDb.name, address: userDb.address };
            faker.helpers.arrayElements(productsDb, nProducts).forEach((product) => {
                products.push({
                    id: product._id,
                    price: product.price,
                    quantity: faker.number.int({ min: 1, max: product.quantity })
                });
            });

            const orderSaved = await createOrderTransaction(req, products);
            const order = await Order.findById(orderSaved.id);
            order.createdAt = faker.date.recent({ days: faker.number.int({ min: 1, max: 365 }) });
            const orderUpdated = await order.save();
            orders.push(orderUpdated.toJSON());

            console.log(`Orden ${i + 1}/${totalOrders} creada correctamente`);
        }

        return res.status(201).json(orders);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteDummyOrders = async (req, res) => {

    try {
        const orders = await Order.find({ userName: { $ne: 'Camilo Saenz' } });

        for (const order of orders) {
            await rejectOrCancelOrderTransaction(order, 'rejected');
            await Order.findByIdAndDelete(order._id);
            console.log(`Orden ${order._id} eliminada correctamente`);
        }

        return res.status(200).json({ message: 'Ordenes rechazadas/canceladas' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

};

export const alterCreateAtOrder = async (req, res) => {
    try {
        const orders = await Order.find();

        for (const order of orders) {
            order.createdAt = faker.date.recent({ days: faker.number.int({ min: 1, max: 60 }) });
            await order.save();
            console.log(`Orden ${order._id} actualizada correctamente`);
        }

        return res.status(200).json({ message: 'Ordenes actualizadas' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

export const alterStatusOrder = async (req, res) => {
    try {
        const orders = await Order.find();

        for (const order of orders) {
            order.status = faker.helpers.arrayElement(['created', 'preparing', 'delivered', 'received', 'canceled', 'rejected']);
            await order.save();
            console.log(`Orden ${order._id} actualizada correctamente`);
        }

        return res.status(200).json({ message: 'Ordenes actualizadas' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

export const replaceImageContentProducts = async (req, res) => {
    try {
        const { pattern, replace } = req.body;
        const products = await Product.find();

        for (const product of products) {
            product.image = product.image.replace(pattern, replace);
            await product.save();
            console.log(`Producto ${product._id} actualizado correctamente`);
        }

        return res.status(200).json({ message: 'Productos actualizados' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}