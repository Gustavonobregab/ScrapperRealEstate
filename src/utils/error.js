class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Define que é um erro controlado
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
