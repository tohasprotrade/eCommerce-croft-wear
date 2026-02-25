const MEASUREMENT_FIELD_REGISTRY = [
    {
        key: 'chest',
        label: 'Chest',
        unit: 'inches',
        inputType: 'number'
    },
    {
        key: 'waist',
        label: 'Waist',
        unit: 'inches',
        inputType: 'number'
    },
    {
        key: 'hip',
        label: 'Hip',
        unit: 'inches',
        inputType: 'number'
    },
    {
        key: 'shoulder',
        label: 'Shoulder',
        unit: 'inches',
        inputType: 'number'
    },
    {
        key: 'sleeve',
        label: 'Sleeve Length',
        unit: 'inches',
        inputType: 'number'
    },
    {
        key: 'length',
        label: 'Length',
        unit: 'inches',
        inputType: 'number'
    },
    {
        key: 'inseam',
        label: 'Inseam',
        unit: 'inches',
        inputType: 'number'
    },
    {
        key: 'neck',
        label: 'Neck',
        unit: 'inches',
        inputType: 'number'
    },
    {
        key: 'weight',
        label: 'Weight',
        unit: 'kg',
        inputType: 'number'
    },
    {
        key: 'height',
        label: 'Height',
        unit: 'cm',
        inputType: 'number'
    },
    {
        key: 'size',
        label: 'Size',
        unit: null,
        inputType: 'select',
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    {
        key: 'color',
        label: 'Color',
        unit: null,
        inputType: 'text'
    },
    {
        key: 'material',
        label: 'Material',
        unit: null,
        inputType: 'text'
    }
];

const VALID_MEASUREMENT_KEYS = MEASUREMENT_FIELD_REGISTRY.map(field => field.key);

const isValidMeasurementKey = (key) => VALID_MEASUREMENT_KEYS.includes(key);

const validateMeasurementFields = (fields, allowedFields) => {
    const errors = [];
    
    for (const field of fields) {
        if (!allowedFields.includes(field)) {
            errors.push(`Invalid measurement field: ${field}`);
        }
    }
    
    return errors;
};

const validateMeasurements = (measurements, allowedFields) => {
    const errors = [];
    
    for (const key of Object.keys(measurements)) {
        if (!allowedFields.includes(key)) {
            errors.push(`Measurement key "${key}" is not allowed for this category`);
        }
        
        const value = measurements[key];
        if (typeof value !== 'number' && typeof value !== 'string') {
            errors.push(`Invalid value type for "${key}"`);
        }
    }
    
    return errors;
};

module.exports = {
    MEASUREMENT_FIELD_REGISTRY,
    VALID_MEASUREMENT_KEYS,
    isValidMeasurementKey,
    validateMeasurementFields,
    validateMeasurements
};
