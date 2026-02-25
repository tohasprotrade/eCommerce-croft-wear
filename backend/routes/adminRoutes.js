const express = require('express');
const router = express.Router();
const { createProduct, deleteProduct, updateProduct, getProductById } = require('../controllers/adminController.js');

router.route('/').post(createProduct);
router.route('/:id').get(getProductById).delete(deleteProduct).put(updateProduct);

module.exports = router;
