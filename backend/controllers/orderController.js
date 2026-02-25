const Order = require('../models/Order');
const Warehouse = require('../models/Warehouse');
const Transaction = require('../models/Transaction');

const generateOrderId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CW-${timestamp}-${random}`;
};

const checkStock = async (items) => {
    const stockErrors = [];

    for (const item of items) {
        const warehouse = await Warehouse.findById(item.productId);

        if (!warehouse) {
            stockErrors.push(`${item.name}: Product not found`);
            continue;
        }

        const size = item.size;
        const currentQty = warehouse.sizes.get(size) || 0;

        if (currentQty < item.quantity) {
            stockErrors.push(`${item.name} (Size: ${size}): Only ${currentQty} available, requested ${item.quantity}`);
        }
    }

    return stockErrors;
};

const deductInventoryOnly = async (items) => {
    const results = [];

    for (const item of items) {
        try {
            const warehouse = await Warehouse.findById(item.productId);

            if (!warehouse) {
                results.push({ success: false, item, message: 'Warehouse item not found' });
                continue;
            }

            const size = item.size;
            let currentQty = warehouse.sizes.get(size) || 0;

            if (currentQty < item.quantity) {
                results.push({ success: false, item, message: `Insufficient stock for size ${size}` });
                continue;
            }

            warehouse.sizes.set(size, currentQty - item.quantity);
            await warehouse.save();

            results.push({ success: true, warehouseId: warehouse._id, productName: item.name, size, quantity: item.quantity, action: 'deduct_inventory' });
        } catch (error) {
            results.push({ success: false, item, message: error.message });
        }
    }

    return results;
};

const recordProfitOnly = async (items, orderId) => {
    const results = [];
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    for (const item of items) {
        try {
            const warehouse = await Warehouse.findById(item.productId);

            if (!warehouse) {
                results.push({ success: false, item, message: 'Warehouse item not found' });
                continue;
            }

            const profit = (item.price - warehouse.purchasePrice) * item.quantity;

            await Transaction.create({
                agentId: warehouse.agentId,
                warehouseId: warehouse._id,
                productName: item.name,
                type: 'sale',
                quantity: item.quantity,
                amount: item.price * item.quantity,
                profit,
                size: item.size,
                orderId,
                month
            });

            results.push({ success: true, warehouseId: warehouse._id, productName: item.name, size: item.size, quantity: item.quantity, profit, action: 'record_profit' });
        } catch (error) {
            results.push({ success: false, item, message: error.message });
        }
    }

    return results;
};

const restoreInventoryAndReverseProfit = async (items, orderId) => {
    const results = [];
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    for (const item of items) {
        try {
            const warehouse = await Warehouse.findById(item.productId);

            if (!warehouse) {
                results.push({ success: false, item, message: 'Warehouse item not found' });
                continue;
            }

            const size = item.size;
            let currentQty = warehouse.sizes.get(size) || 0;
            warehouse.sizes.set(size, currentQty + item.quantity);

            const reverseProfit = -((item.price - warehouse.purchasePrice) * item.quantity);

            await Transaction.create({
                agentId: warehouse.agentId,
                warehouseId: warehouse._id,
                productName: item.name,
                type: 'return',
                quantity: item.quantity,
                amount: item.price * item.quantity,
                profit: reverseProfit,
                size,
                orderId,
                month
            });

            await warehouse.save();

            results.push({ success: true, warehouseId: warehouse._id, productName: item.name, size, quantity: item.quantity, profit: reverseProfit, action: 'restore_inventory_reverse_profit' });
        } catch (error) {
            results.push({ success: false, item, message: error.message });
        }
    }

    return results;
};

const restoreInventoryOnly = async (items) => {
    const results = [];

    for (const item of items) {
        try {
            const warehouse = await Warehouse.findById(item.productId);

            if (!warehouse) {
                results.push({ success: false, item, message: 'Warehouse item not found' });
                continue;
            }

            const size = item.size;
            let currentQty = warehouse.sizes.get(size) || 0;
            warehouse.sizes.set(size, currentQty + item.quantity);
            await warehouse.save();

            results.push({ success: true, warehouseId: warehouse._id, productName: item.name, size, quantity: item.quantity, action: 'restore_inventory' });
        } catch (error) {
            results.push({ success: false, item, message: error.message });
        }
    }

    return results;
};

const createOrder = async (req, res) => {
    try {
        const { customerInfo, deliveryInfo, items, subtotal, shippingCost, total, shippingMethod, paymentMethod, notes } = req.body;

        if (!customerInfo || !deliveryInfo || !items || !total) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const orderId = generateOrderId();

        const order = await Order.create({
            orderId,
            customerInfo,
            deliveryInfo,
            items,
            subtotal,
            shippingCost,
            total,
            shippingMethod,
            paymentMethod,
            notes,
            status: 'pending_acceptance'
        });

        res.status(201).json({ 
            order,
            message: 'Order submitted successfully. Waiting for admin approval.'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const acceptOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'pending_acceptance') {
            return res.status(400).json({ message: 'Order has already been processed' });
        }

        const stockErrors = await checkStock(order.items);
        
        if (stockErrors.length > 0) {
            return res.status(400).json({ 
                message: 'Insufficient stock for some items', 
                errors: stockErrors 
            });
        }

        const results = await deductInventoryOnly(order.items);
        
        const hasErrors = results.some(r => !r.success);
        if (hasErrors) {
            return res.status(400).json({ 
                message: 'Failed to process some items', 
                errors: results.filter(r => !r.success) 
            });
        }

        order.status = 'accepted';
        order.acceptedAt = new Date();
        
        const updatedOrder = await order.save();
        
        res.json({ 
            order: updatedOrder,
            message: 'Order accepted successfully. Inventory deducted. Profit will be calculated upon delivery.'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;
        
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const previousStatus = order.status;
        const newStatus = status || order.status;
        
        if (newStatus === 'delivered' && previousStatus === 'accepted') {
            const profitResults = await recordProfitOnly(order.items, order.orderId);
            const hasErrors = profitResults.some(r => !r.success);
            if (hasErrors) {
                console.warn('Profit recording errors:', profitResults.filter(r => !r.success));
            }
            
            order.status = newStatus;
            if (notes !== undefined) {
                order.notes = notes;
            }
            const updatedOrder = await order.save();
            return res.json({ order: updatedOrder, message: 'Order delivered. Profit calculated and recorded.' });
        }
        
        if ((newStatus === 'cancelled' || newStatus === 'returned') && previousStatus === 'accepted') {
            const results = await restoreInventoryOnly(order.items);
            const hasErrors = results.some(r => !r.success);
            if (hasErrors) {
                console.warn('Inventory restore errors:', results.filter(r => !r.success));
            }
            
            order.status = newStatus;
            if (notes !== undefined) {
                order.notes = notes;
            }
            const updatedOrder = await order.save();
            return res.json({ order: updatedOrder, message: 'Order cancelled. Inventory restored.' });
        }

        if ((newStatus === 'cancelled' || newStatus === 'returned') && previousStatus === 'delivered') {
            const results = await restoreInventoryAndReverseProfit(order.items, order.orderId);
            const hasErrors = results.some(r => !r.success);
            if (hasErrors) {
                console.warn('Inventory restore and profit reverse errors:', results.filter(r => !r.success));
            }
            
            order.status = newStatus;
            if (notes !== undefined) {
                order.notes = notes;
            }
            const updatedOrder = await order.save();
            return res.json({ order: updatedOrder, message: 'Order returned. Inventory restored and profit reversed.' });
        }

        if ((newStatus === 'cancelled' || newStatus === 'returned') && previousStatus === 'pending_acceptance') {
            order.status = newStatus;
            if (notes !== undefined) {
                order.notes = notes;
            }
            const updatedOrder = await order.save();
            return res.json(updatedOrder);
        }
        
        order.status = newStatus;
        if (notes !== undefined) {
            order.notes = notes;
        }
        
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status === 'accepted' || order.status === 'delivered') {
            return res.status(400).json({ message: 'Cannot delete processed orders' });
        }
        
        await order.deleteOne();
        res.json({ message: 'Order removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    acceptOrder,
    updateOrderStatus,
    deleteOrder,
    deductInventoryOnly,
    recordProfitOnly,
    restoreInventoryAndReverseProfit,
    restoreInventoryOnly
};
