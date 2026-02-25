// Input validation utilities
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    // At least 6 characters, 1 letter, 1 number
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
};

const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

const validatePrice = (price) => {
    const num = parseFloat(price);
    return !isNaN(num) && num > 0;
};

const validateStringLength = (str, min = 1, max = 500) => {
    return typeof str === 'string' && str.length >= min && str.length <= max;
};

const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/[<>]/g, '');
};

const validateMongoId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

module.exports = {
    validateEmail,
    validatePassword,
    validatePhoneNumber,
    validatePrice,
    validateStringLength,
    sanitizeString,
    validateMongoId,
};
