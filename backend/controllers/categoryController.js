const Category = require('../models/Category');
const {
    MEASUREMENT_FIELD_REGISTRY,
    validateMeasurementFields
} = require('../config/measurementRegistry');

const VALID_FIELD_KEYS = MEASUREMENT_FIELD_REGISTRY.map(f => f.key);

const getMeasurementFields = async (req, res) => {
    try {
        res.json(MEASUREMENT_FIELD_REGISTRY);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, measurementFields, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const normalizedName = name.toLowerCase().trim();
        
        const existingCategory = await Category.findOne({ name: normalizedName });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        let fieldsToSave = [];
        if (measurementFields && Array.isArray(measurementFields)) {
            const validationErrors = validateMeasurementFields(measurementFields, VALID_FIELD_KEYS);
            
            if (validationErrors.length > 0) {
                return res.status(400).json({ 
                    message: 'Invalid measurement fields',
                    errors: validationErrors 
                });
            }
            
            fieldsToSave = measurementFields;
        }

        const category = new Category({
            name: normalizedName,
            measurementFields: fieldsToSave,
            description: description || ''
        });

        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name, measurementFields, description, isActive } = req.body;
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (name) {
            const normalizedName = name.toLowerCase().trim();
            const existingCategory = await Category.findOne({ 
                name: normalizedName,
                _id: { $ne: category._id }
            });
            
            if (existingCategory) {
                return res.status(400).json({ message: 'Category name already exists' });
            }
            category.name = normalizedName;
        }

        if (measurementFields && Array.isArray(measurementFields)) {
            const validationErrors = validateMeasurementFields(measurementFields, VALID_FIELD_KEYS);
            
            if (validationErrors.length > 0) {
                return res.status(400).json({ 
                    message: 'Invalid measurement fields',
                    errors: validationErrors 
                });
            }
            
            category.measurementFields = measurementFields;
        }

        if (description !== undefined) {
            category.description = description;
        }

        if (isActive !== undefined) {
            category.isActive = isActive;
        }

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            await category.deleteOne();
            res.json({ message: 'Category removed' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getMeasurementFields,
    createCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory
};
