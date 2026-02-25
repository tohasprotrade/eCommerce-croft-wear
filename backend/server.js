require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./config/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to Database
connectDB();

// Enhanced CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            process.env.FRONTEND_URL || 'http://localhost:3000',
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else if (NODE_ENV === 'development') {
            // Allow any origin in development
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Request logging middleware (development only)
if (NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
        next();
    });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// API root endpoint
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'API is running...',
        version: '1.0.0',
    });
});

// Import Routes
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const headerRoutes = require('./routes/headerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const agentRoutes = require('./routes/agentRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Mount Routes
app.use('/api/admin/products', adminRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/user/products', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin/header', headerRoutes);
app.use('/api/admin/orders', orderRoutes);
app.use('/api/admin/collections', collectionRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/transactions', transactionRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
    });
});

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║   Server running on port ${PORT}          ║
    ║   Environment: ${NODE_ENV}           ║
    ║   ${new Date().toISOString()}  ║
    ╚════════════════════════════════════════╝
    `);
});

