const express = require('express');
const router = express.Router();
const { getSlides, createSlide, updateSlide, deleteSlide } = require('../controllers/slideController');

router.route('/slides').get(getSlides).post(createSlide);
router.route('/slides/:id').put(updateSlide).delete(deleteSlide);

module.exports = router;
