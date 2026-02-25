// Standardized API response formatter
const apiResponse = {
    success: (res, data, message = 'Success', statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    },

    error: (res, message = 'Error', statusCode = 500, errors = null) => {
        const response = {
            success: false,
            message,
        };
        if (errors) {
            response.errors = errors;
        }
        return res.status(statusCode).json(response);
    },

    paginated: (res, data, total, page, limit, message = 'Success', statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    },
};

module.exports = apiResponse;
