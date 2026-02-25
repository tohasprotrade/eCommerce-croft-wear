const mongoose = require('mongoose');

const headerSlideSchema = new mongoose.Schema({
    title: {
        type: String,
        default: ''
    },
    subtitle: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const HeaderSlide = mongoose.model('HeaderSlide', headerSlideSchema);

module.exports = HeaderSlide;
