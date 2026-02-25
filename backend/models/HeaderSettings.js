const mongoose = require('mongoose');

const headerSettingsSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Elevate Your Style'
    },
    subtitle: {
        type: String,
        default: 'Visit Our Collections'
    },
    image: {
        type: String,
        default: ''
    },
    sliderImages: [{
        type: String
    }]
}, {
    timestamps: true
});

const HeaderSettings = mongoose.model('HeaderSettings', headerSettingsSchema);

module.exports = HeaderSettings;
