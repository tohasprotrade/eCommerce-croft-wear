const express = require('express');
const router = express.Router();
const { getProducts, getProductsByCategory, getProductById, getSingleProduct } = require('../controllers/userController.js');

router.route('/').get(getProducts);
router.route('/category/:category').get(getProductsByCategory);
router.route('/:slug').get(getSingleProduct);
router.route('/:id').get(getProductById);

module.exports = router;
