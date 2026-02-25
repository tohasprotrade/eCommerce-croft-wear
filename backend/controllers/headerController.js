const HeaderSettings = require('../models/HeaderSettings');

// @desc    Get header settings
// @route   GET /api/admin/header
// @access  Public
const getHeaderSettings = async (req, res) => {
    try {
        let settings = await HeaderSettings.findOne({});
        
        if (!settings) {
            settings = await HeaderSettings.create({
                title: 'Elevate Your Style',
                subtitle: 'Visit Our Collections',
                sliderImages: []
            });
        }
        
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update header settings
// @route   PUT /api/admin/header
// @access  Public
const updateHeaderSettings = async (req, res) => {
    try {
        const { title, subtitle, sliderImages } = req.body;
        
        let settings = await HeaderSettings.findOne({});
        
        if (settings) {
            settings.title = title || settings.title;
            settings.subtitle = subtitle || settings.subtitle;
            settings.sliderImages = sliderImages || settings.sliderImages;
            
            const updatedSettings = await settings.save();
            res.json(updatedSettings);
        } else {
            const newSettings = await HeaderSettings.create({
                title: title || 'Elevate Your Style',
                subtitle: subtitle || 'Visit Our Collections',
                sliderImages: sliderImages || []
            });
            res.json(newSettings);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getHeaderSettings,
    updateHeaderSettings
};
