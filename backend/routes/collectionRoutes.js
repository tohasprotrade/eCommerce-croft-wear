const express = require('express');
const router = express.Router();
const { 
    getCollections, 
    getActiveCollections, 
    createCollection, 
    updateCollection, 
    deleteCollection,
    addProductToCollection,
    removeProductFromCollection,
    getCollectionWithProducts
} = require('../controllers/collectionController');

router.route('/').get(getCollections).post(createCollection);
router.route('/active').get(getActiveCollections);
router.route('/:id').put(updateCollection).delete(deleteCollection).get(getCollectionWithProducts);
router.route('/:id/products').post(addProductToCollection);
router.route('/:id/products/remove').post(removeProductFromCollection);

module.exports = router;
