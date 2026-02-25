const express = require('express');
const router = express.Router();
const { 
    createWarehouseItem, 
    getWarehouseItems, 
    getWarehouseItemById, 
    updateWarehouseItem, 
    togglePublicStatus,
    deleteWarehouseItem,
    getPublicProducts
} = require('../controllers/warehouseController');
const { authMiddleware, superAgentOnly } = require('../config/authMiddleware');

router.post('/', authMiddleware, createWarehouseItem);
router.get('/', authMiddleware, getWarehouseItems);
router.get('/public', getPublicProducts);
router.get('/:id', authMiddleware, getWarehouseItemById);
router.put('/:id', authMiddleware, updateWarehouseItem);
router.patch('/:id/toggle-public', authMiddleware, togglePublicStatus);
router.delete('/:id', authMiddleware, deleteWarehouseItem);

module.exports = router;
