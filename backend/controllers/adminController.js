const Product = require('../models/Product');
const Category = require('../models/Category');
const slugify = require('slugify');
const { validateMeasurements } = require('../config/measurementRegistry');

const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, image, measurements } = req.body;

        if (!name || !price || !description || !category || !image) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const categoryDoc = await Category.findById(category);
        if (!categoryDoc) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        let measurementsData = {};
        if (measurements && typeof measurements === 'object') {
            const validationErrors = validateMeasurements(
                measurements, 
                categoryDoc.measurementFields
            );

            if (validationErrors.length > 0) {
                return res.status(400).json({ 
                    message: 'Invalid measurements',
                    errors: validationErrors 
                });
            }

            measurementsData = new Map(Object.entries(measurements));
        }

        const slug = 
            slugify(name, { lower: true, strict: true }) 
            + "-" + 
            Date.now().toString().slice(-5);

        const product = new Product({
            name,
            price,
            description,
            category: categoryDoc._id,
            categoryName: categoryDoc.name,
            image,
            slug,
            measurements: measurementsData
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, price, description, category, image, measurements } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (name) product.name = name;
        if (price) product.price = price;
        if (description) product.description = description;
        if (image) product.image = image;

        if (category) {
            const categoryDoc = await Category.findById(category);
            if (!categoryDoc) {
                return res.status(400).json({ message: 'Invalid category' });
            }
            product.category = categoryDoc._id;
            product.categoryName = categoryDoc.name;
        }

        if (measurements && typeof measurements === 'object') {
            const categoryDoc = await Category.findById(product.category);
            const allowedFields = categoryDoc?.measurementFields || [];
            
            const validationErrors = validateMeasurements(measurements, allowedFields);

            if (validationErrors.length > 0) {
                return res.status(400).json({ 
                    message: 'Invalid measurements',
                    errors: validationErrors 
                });
            }

            product.measurements = new Map(Object.entries(measurements));
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');

        if (product) {
            const productObj = product.toObject();
            productObj.measurements = Object.fromEntries(product.measurements || new Map());
            res.json(productObj);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    getProductById
};
