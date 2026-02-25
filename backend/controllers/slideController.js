const HeaderSlide = require('../models/HeaderSlide');

// @desc    Get all active header slides
// @route   GET /api/admin/header/slides
// @access  Public
const getSlides = async (req, res) => {
    try {
        const slides = await HeaderSlide.find({ isActive: true }).sort({ order: 1 });
        res.json(slides);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create new header slide
// @route   POST /api/admin/header/slides
// @access  Public
const createSlide = async (req, res) => {
    try {
        const { title, subtitle, image, order } = req.body;
        
        const slide = await HeaderSlide.create({
            title,
            subtitle,
            image,
            order: order || 0
        });
        
        res.status(201).json(slide);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update header slide
// @route   PUT /api/admin/header/slides/:id
// @access  Public
const updateSlide = async (req, res) => {
    try {
        const { title, subtitle, image, order, isActive } = req.body;
        
        const slide = await HeaderSlide.findById(req.params.id);
        
        if (!slide) {
            return res.status(404).json({ message: 'Slide not found' });
        }
        
        slide.title = title || slide.title;
        slide.subtitle = subtitle || slide.subtitle;
        slide.image = image || slide.image;
        slide.order = order !== undefined ? order : slide.order;
        slide.isActive = isActive !== undefined ? isActive : slide.isActive;
        
        const updatedSlide = await slide.save();
        res.json(updatedSlide);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete header slide
// @route   DELETE /api/admin/header/slides/:id
// @access  Public
const deleteSlide = async (req, res) => {
    try {
        console.log('Deleting slide with ID:', req.params.id);
        const slide = await HeaderSlide.findById(req.params.id);
        
        if (!slide) {
            console.log('Slide not found');
            return res.status(404).json({ message: 'Slide not found' });
        }
        
        await slide.deleteOne();
        console.log('Slide deleted successfully');
        res.json({ message: 'Slide removed' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getSlides,
    createSlide,
    updateSlide,
    deleteSlide
};
