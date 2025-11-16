export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    console.error('Error:', err);
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = createError(message, 404);
    }
    if (err.statusCode === 11000) {
        const message = 'Duplicate field value entered';
        error = createError(message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
    });
};
export const notFound = (req, res, next) => {
    const error = createError(`Not found - ${req.originalUrl}`, 404);
    next(error);
};
const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};