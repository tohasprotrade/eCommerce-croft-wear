const mongoose = require('mongoose');
const slugify = require('slugify');

const warehouseSchema = new mongoose.Schema({
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    description: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    sizes: {
        type: Map,
        of: Number,
        default: {}
    },
    purchasePrice: {
        type: Number,
        required: true,
        default: 0
    },
    sellingPrice: {
        type: Number,
        default: 0
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    measurements: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

warehouseSchema.pre('save', function(next) {
    if (this.isModified('productName')) {
        this.slug = slugify(this.productName, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-5);
    }
    next();
});

warehouseSchema.virtual('totalQuantity').get(function() {
    if (!this.sizes) return 0;
    let total = 0;
    for (const qty of this.sizes.values()) {
        total += qty;
    }
    return total;
});

warehouseSchema.set('toJSON', { virtuals: true });
warehouseSchema.set('toObject', { virtuals: true });

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;
