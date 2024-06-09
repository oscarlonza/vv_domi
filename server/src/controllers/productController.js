import { addFileToRepository } from '../libs/fileManager.js';
import { Product } from '../models/product.js';
import faker from 'faker';

/*
Controlador para la entidad Product.
*/

// Crear 200 productos usando Faker
export const createMultipleProducts = async (req, res) => {
    try {
        const products = [];
        for (let i = 0; i < 200; i++) {
            const name = faker.commerce.productName();
            const price = faker.commerce.price();
            const description = faker.lorem.sentence();
            const quantity = faker.random.number(50);
            //TODO Cambiar ruta por la imagen del frontend
            const image = 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQV2ernxmFQGWFguDZjoSy_e5kgSTAcnvEBkunQO3POpIaEGcMg';
            const newProduct = new Product({ name, price, description, quantity, image });
            await newProduct.save();
            products.push(newProduct.toJSON());
        }

        return res.status(201).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Obtener los productos paginados
export const getPaginatedProducts = async (req, res) => {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    try {
        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limitNumber);

        const products = await Product.find()
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
    const { id } = req.params;
    try {
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
    const { name, price, description, quantity, image } = req.body;
    try {
        const imageUrl = addFileToRepository(image);

        const newProduct = await Product({ name, price, description, quantity, image: imageUrl });
        await newProduct.save();

        return res.status(201).json(newProduct);
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear el producto' });
    }
};

// Actualizar un producto existente
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, quantity, image } = req.body;
    try {
        //TODO add image to bag of images

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, price, description },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto existente
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
};

