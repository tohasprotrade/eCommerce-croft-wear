const Collection = require('../models/Collection');

const getCollections = async (req, res) => {
    try {
        const collections = await Collection.find({}).sort({ createdAt: -1 });
        res.json(collections);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getActiveCollections = async (req, res) => {
    try {
        const collections = await Collection.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(collections);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const createCollection = async (req, res) => {
    try {
        const { name, coverImage } = req.body;
        
        const collection = await Collection.create({
            name,
            coverImage
        });
        
        res.status(201).json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateCollection = async (req, res) => {
    try {
        const { name, coverImage, isActive } = req.body;
        
        const collection = await Collection.findById(req.params.id);
        
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        
        collection.name = name || collection.name;
        collection.coverImage = coverImage || collection.coverImage;
        collection.isActive = isActive !== undefined ? isActive : collection.isActive;
        
        const updatedCollection = await collection.save();
        res.json(updatedCollection);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);
        
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        
        await collection.deleteOne();
        res.json({ message: 'Collection removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const addProductToCollection = async (req, res) => {
    try {
        const { productId } = req.body;
        const collection = await Collection.findById(req.params.id);
        
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        
        if (!collection.products.includes(productId)) {
            collection.products.push(productId);
            await collection.save();
        }
        
        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const removeProductFromCollection = async (req, res) => {
    try {
        const { productId } = req.body;
        const collection = await Collection.findById(req.params.id);
        
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        
        collection.products = collection.products.filter(
            p => p.toString() !== productId
        );
        await collection.save();
        
        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getCollectionWithProducts = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id).populate('products');
        
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        
        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getCollections,
    getActiveCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    addProductToCollection,
    removeProductFromCollection,
    getCollectionWithProducts
};
