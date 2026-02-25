const express = require('express');
const router = express.Router();
const {
    getMeasurementFields,
    createCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController.js');

router.get('/measurement-fields', getMeasurementFields);
router.route('/')
    .get(getAllCategories)
    .post(createCategory);
router.route('/:id')
    .get(getCategoryById)
    .put(updateCategory)
    .delete(deleteCategory);

module.exports = router;
