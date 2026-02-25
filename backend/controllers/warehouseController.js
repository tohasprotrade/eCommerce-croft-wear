const Warehouse = require('../models/Warehouse');
const Transaction = require('../models/Transaction');

const createWarehouseItem = async (req, res) => {
    try {
        const { productName, description, category, image, sizes, purchasePrice, sellingPrice, measurements } = req.body;

        if (!productName || !purchasePrice) {
            return res.status(400).json({ message: 'Please provide product name and purchase price' });
        }

        const sizesMap = new Map();
        if (sizes && typeof sizes === 'object') {
            Object.entries(sizes).forEach(([key, value]) => {
                if (value > 0) {
                    sizesMap.set(key, value);
                }
            });
        }

        const warehouse = await Warehouse.create({
            agentId: req.agent._id,
            productName,
            description: description || '',
            category: category || '',
            image: image || '',
            sizes: sizesMap,
            purchasePrice: purchasePrice || 0,
            sellingPrice: sellingPrice || 0,
            measurements: measurements ? new Map(Object.entries(measurements)) : new Map()
        });

        const totalQty = warehouse.totalQuantity;
        if (totalQty > 0) {
            const now = new Date();
            const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            
            await Transaction.create({
                agentId: req.agent._id,
                warehouseId: warehouse._id,
                productName: warehouse.productName,
                type: 'purchase',
                quantity: totalQty,
                amount: purchasePrice * totalQty,
                profit: 0,
                size: 'all',
                month
            });
        }

        res.status(201).json(warehouse);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getWarehouseItems = async (req, res) => {
    try {
        const { isPublic, page = 1, limit = 50 } = req.query;
        
        let query = {};
        
        if (req.agent.role === 'super_agent') {
            if (isPublic !== undefined) {
                query.isPublic = isPublic === 'true';
            }
        } else {
            query.agentId = req.agent._id;
        }

        const total = await Warehouse.countDocuments(query);
        const items = await Warehouse.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            items,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getWarehouseItemById = async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id);

        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse item not found' });
        }

        if (req.agent.role !== 'super_agent' && warehouse.agentId.toString() !== req.agent._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(warehouse);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateWarehouseItem = async (req, res) => {
    try {
        const { productName, description, category, image, sizes, purchasePrice, sellingPrice, isPublic, measurements } = req.body;

        const warehouse = await Warehouse.findById(req.params.id);

        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse item not found' });
        }

        if (req.agent.role !== 'super_agent' && warehouse.agentId.toString() !== req.agent._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const oldTotalQty = warehouse.totalQuantity;

        if (productName) warehouse.productName = productName;
        if (description !== undefined) warehouse.description = description;
        if (category !== undefined) warehouse.category = category;
        if (image !== undefined) warehouse.image = image;
        if (purchasePrice !== undefined) warehouse.purchasePrice = purchasePrice;
        if (sellingPrice !== undefined) warehouse.sellingPrice = sellingPrice;
        if (isPublic !== undefined && req.agent.role === 'super_agent') warehouse.isPublic = isPublic;
        
        if (sizes && typeof sizes === 'object') {
            const sizesMap = new Map();
            Object.entries(sizes).forEach(([key, value]) => {
                sizesMap.set(key, value);
            });
            warehouse.sizes = sizesMap;
        }

        if (measurements && typeof measurements === 'object') {
            warehouse.measurements = new Map(Object.entries(measurements));
        }

        const updatedWarehouse = await warehouse.save();

        const newTotalQty = updatedWarehouse.totalQuantity;
        
        if (newTotalQty !== oldTotalQty) {
            const now = new Date();
            const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            const qtyDiff = newTotalQty - oldTotalQty;
            
            if (qtyDiff !== 0) {
                await Transaction.create({
                    agentId: req.agent._id,
                    warehouseId: updatedWarehouse._id,
                    productName: updatedWarehouse.productName,
                    type: qtyDiff > 0 ? 'purchase' : 'adjustment',
                    quantity: Math.abs(qtyDiff),
                    amount: Math.abs(qtyDiff) * purchasePrice,
                    profit: 0,
                    size: 'all',
                    month,
                    notes: `Stock adjustment: ${qtyDiff > 0 ? 'added' : 'removed'} ${Math.abs(qtyDiff)} units`
                });
            }
        }

        res.json(updatedWarehouse);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const togglePublicStatus = async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id);

        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse item not found' });
        }

        if (req.agent.role !== 'super_agent' && warehouse.agentId.toString() !== req.agent._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        warehouse.isPublic = !warehouse.isPublic;
        await warehouse.save();

        res.json({ 
            message: warehouse.isPublic ? 'Product is now public' : 'Product is now private',
            isPublic: warehouse.isPublic 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteWarehouseItem = async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id);

        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse item not found' });
        }

        if (req.agent.role !== 'super_agent' && warehouse.agentId.toString() !== req.agent._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await Transaction.deleteMany({ warehouseId: warehouse._id });
        await warehouse.deleteOne();

        res.json({ message: 'Warehouse item removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deductStock = async (items) => {
    try {
        const results = [];
        
        for (const item of items) {
            const warehouse = await Warehouse.findOne({
                _id: item.warehouseId || item.productId,
                'sizes': { $exists: true }
            });

            if (!warehouse) {
                results.push({ success: false, item, message: 'Warehouse item not found' });
                continue;
            }

            const size = item.size;
            const currentQty = warehouse.sizes.get(size) || 0;

            if (currentQty < item.quantity) {
                results.push({ 
                    success: false, 
                    item, 
                    message: `Insufficient stock for size ${size}. Available: ${currentQty}` 
                });
                continue;
            }

            warehouse.sizes.set(size, currentQty - item.quantity);
            await warehouse.save();

            results.push({ success: true, warehouseId: warehouse._id, size, quantity: item.quantity });
        }

        return results;
    } catch (error) {
        throw error;
    }
};

const getPublicProducts = async (req, res) => {
    try {
        const { category, page = 1, limit = 20 } = req.query;

        let query = { isPublic: true };

        if (category) {
            query.category = category;
        }

        const total = await Warehouse.countDocuments(query);
        const products = await Warehouse.find(query)
            .populate('agentId', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const productsWithoutSecret = products.map(p => ({
            _id: p._id,
            productName: p.productName,
            description: p.description,
            category: p.category,
            image: p.image,
            sizes: Object.fromEntries(p.sizes),
            sellingPrice: p.sellingPrice,
            measurements: Object.fromEntries(p.measurements),
            agentName: p.agentId?.name
        }));

        res.json({
            items: productsWithoutSecret,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createWarehouseItem,
    getWarehouseItems,
    getWarehouseItemById,
    updateWarehouseItem,
    togglePublicStatus,
    deleteWarehouseItem,
    deductStock,
    getPublicProducts
};
