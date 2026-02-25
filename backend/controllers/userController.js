const Warehouse = require('../models/Warehouse.js');
const mongoose = require('mongoose');

// @desc    Fetch all public products
// @route   GET /api/user/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Warehouse.find({ isPublic: true })
            .populate('agentId', 'name')
            .sort({ createdAt: -1 });
        
        const productsData = products.map(p => ({
            _id: p._id,
            name: p.productName,
            slug: p.slug || p._id.toString(),
            price: p.sellingPrice,
            description: p.description,
            category: p.category,
            categoryName: p.category,
            image: p.image,
            measurements: Object.fromEntries(p.measurements || new Map()),
            sizes: Object.fromEntries(p.sizes || new Map()),
            purchasePrice: p.purchasePrice,
            warehouseId: p._id
        }));
        
        res.json(productsData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Fetch products by category
// @route   GET /api/user/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
    try {
        const products = await Warehouse.find({ 
            isPublic: true,
            category: req.params.category 
        }).populate('agentId', 'name');
        
        const productsData = products.map(p => ({
            _id: p._id,
            name: p.productName,
            slug: p.slug || p._id.toString(),
            price: p.sellingPrice,
            description: p.description,
            category: p.category,
            categoryName: p.category,
            image: p.image,
            measurements: Object.fromEntries(p.measurements || new Map()),
            sizes: Object.fromEntries(p.sizes || new Map()),
            purchasePrice: p.purchasePrice,
            warehouseId: p._id
        }));
        
        res.json(productsData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/user/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const product = await Warehouse.findById(req.params.id).populate('agentId', 'name');
        
        if (product) {
            const productData = {
                _id: product._id,
                name: product.productName,
                slug: product.slug || product._id.toString(),
                price: product.sellingPrice,
                description: product.description,
                category: product.category,
                categoryName: product.category,
                image: product.image,
                measurements: Object.fromEntries(product.measurements || new Map()),
                sizes: Object.fromEntries(product.sizes || new Map()),
                purchasePrice: product.purchasePrice,
                warehouseId: product._id
            };
            res.json(productData);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getSingleProduct = async (req, res) => {
    try {
        const { slug } = req.params;
        let product = null;

        // First try to find by MongoDB ID
        if (mongoose.Types.ObjectId.isValid(slug)) {
            product = await Warehouse.findOne({ 
                _id: slug,
                isPublic: true 
            }).populate('agentId', 'name');
        }

        // If not found by ID, try to find by slug field
        if (!product) {
            product = await Warehouse.findOne({ 
                slug: slug,
                isPublic: true 
            }).populate('agentId', 'name');
        }

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const productData = {
            _id: product._id,
            name: product.productName,
            slug: product.slug,
            price: product.sellingPrice,
            description: product.description,
            category: product.category,
            categoryName: product.category,
            image: product.image,
            measurements: Object.fromEntries(product.measurements || new Map()),
            sizes: Object.fromEntries(product.sizes || new Map()),
            purchasePrice: product.purchasePrice,
            warehouseId: product._id
        };
        
        res.json(productData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


module.exports = {
    getProducts,
    getProductsByCategory,
    getProductById,
    getSingleProduct
};
