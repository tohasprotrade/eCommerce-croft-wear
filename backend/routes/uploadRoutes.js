const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const apiResponse = require('../config/apiResponse');
const logger = require('../config/logger');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadsDir);
    },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
});

// Validate file type
function validateFileType(file, cb) {
    const allowedTypes = /jpg|jpeg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('Only image files are allowed (jpg, jpeg, png, webp, gif)'));
}

// Configure multer
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        validateFileType(file, cb);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

// Upload endpoint
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            logger.warn('Image upload failed: No file provided');
            return apiResponse.error(res, 'No file provided', 400);
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        logger.info(`Image uploaded successfully: ${req.file.filename}`);

        return apiResponse.success(
            res,
            {
                filename: req.file.filename,
                image: imageUrl,
                size: req.file.size,
                mimetype: req.file.mimetype,
            },
            'Image uploaded successfully',
            201
        );
    } catch (error) {
        logger.error('Image upload error', error);
        return apiResponse.error(res, error.message || 'Upload failed', 500);
    }
});

// Error handling for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'FILE_TOO_LARGE') {
            return apiResponse.error(res, 'File size exceeds 5MB limit', 400);
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return apiResponse.error(res, 'Only one file can be uploaded', 400);
        }
        logger.error('Multer error', error);
        return apiResponse.error(res, 'File upload error', 400);
    }

    if (error) {
        logger.error('Upload error', error);
        return apiResponse.error(res, error.message || 'Upload failed', 400);
    }

    next();
});

module.exports = router;
