const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        required: true
    },
    customerInfo: {
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    deliveryInfo: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            default: ''
        },
        country: {
            type: String,
            default: 'Bangladesh'
        },
        region: {
            type: String,
            default: ''
        }
    },
    items: [orderItemSchema],
    subtotal: {
        type: Number,
        required: true
    },
    shippingCost: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    shippingMethod: {
        type: String,
        enum: ['dhaka', 'dhaka_suburban', 'outside_dhaka'],
        required: true
    },
    paymentMethod: {
        type: String,
        default: 'cod'
    },
    status: {
        type: String,
        enum: ['pending_acceptance', 'accepted', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'pending_acceptance'
    },
    acceptedAt: {
        type: Date,
        default: null
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
