import { addFileToRepository } from '../libs/fileManager.js';
import { Product } from '../models/product.js';
import { Comment } from '../models/comment.js';

import faker from 'faker';

/*
Controlador para la entidad Product.
*/

// Crear 200 productos usando Faker
export const createMultipleProducts = async (req, res) => {
    try {
        const products = [];
        const { totalProducts } = req.body;
        const total = parseInt(totalProducts) || 200;

        for (let i = 0; i < total; i++) {
            const name = faker.commerce.productName();
            const price = faker.commerce.price();
            const description = faker.lorem.sentence();
            const quantity = faker.datatype.number({ min: 0, max: 50 });
            //TODO Cambiar ruta por la imagen del frontend
            const image = addFileToRepository(req);
            const newProduct = new Product({ name, price, description, quantity, image });
            await newProduct.save();

            const nComments = faker.datatype.number({ min: 0, max: 50 });
            for (let j = 0; j < nComments; j++) {
                const comment = faker.lorem.sentence();
                const rating = faker.datatype.number({ min: 1, max: 5 });
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

// Obtener los productos paginados
export const getPaginatedProducts = async (req, res) => {
    try {
        const { page, limit, filter } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;

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

// Obtener un producto por su ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        return res.status(200).json(product.toJSON());
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        const { name, price, description, quantity, image } = req.body;

        const imageUrl = addFileToRepository(req, image);

        const newProduct = new Product({ name, price, description, quantity, image: imageUrl });
        await newProduct.save();

        return res.status(201).json(newProduct);
    } catch (error) {
        return res.status(400).json({ message: error.message.replace('Product validation failed: ', '') });
    }
};

// Actualizar un producto existente
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, quantity, image } = req.body;

        const productFound = await Product.findById(id);
        if (!productFound)
            return res.status(404).json({ message: 'Producto no encontrado' });

        if (productFound.image !== image)
            productFound.image = addFileToRepository(req, image);

        productFound.name = name;
        productFound.price = price;
        productFound.description = description;
        productFound.quantity = quantity;

        await productFound.save();

        res.status(200).json(productFound.toJSON());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un producto existente
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        await Comment.deleteMany({ product: deletedProduct._id });

        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name: userName } = req.user;
        const { comment, rating } = req.body;

        const productFound = await Product.findById(id);
        if (!productFound)
            return res.status(404).json({ message: 'Producto no encontrado' });

        const newComment = new Comment({ comment, rating, product: productFound._id, userName });
        await newComment.save();

        productFound.comments.push(newComment.rating);
        await productFound.save();

        return res.status(201).json({ comment: newComment.comment, rating: newComment.rating });

    } catch (error) {
        return res.status(500).json({ message: error.message.replace('Comment validation failed: ', '') });
    }

};

export const getPaginatedCommentsByProductId = async (req, res) => {
    try {

        const { id } = req.params;
        const { page, limit } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;

        const productFound = await Product.findById(id);

        if (!productFound)
            return res.status(404).json({ message: 'Producto no encontrado' });

        const totalComments = await Comment.countDocuments({ product: productFound._id });
        const totalPages = Math.ceil(totalComments / limitNumber);

        const comments = await Comment
            .find({ product: productFound._id })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        return res.status(200).json({
            page: pageNumber,
            limit: limitNumber,
            totalPages: totalPages,
            totalComments: totalComments,
            comments: comments.map(comment => comment.toJSON())
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

