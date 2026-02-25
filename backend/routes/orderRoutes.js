const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, acceptOrder, updateOrderStatus, deleteOrder } = require('../controllers/orderController');

router.route('/').get(getOrders).post(createOrder);
router.route('/:id').get(getOrderById).put(updateOrderStatus).delete(deleteOrder);
router.route('/:id/accept').put(acceptOrder);

module.exports = router;
