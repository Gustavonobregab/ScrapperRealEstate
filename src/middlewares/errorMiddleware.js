const errorMiddleware = (err, req, res, next) => {
    console.error(err); // Log do erro

    // Se for um erro conhecido, usa o status informado, senão usa 500 (Erro interno)
    const statusCode = err.statusCode || 500;
    const message = err.message || "Erro interno no servidor";

    res.status(statusCode).json({
        success: false,
        message
    });
};

export default errorMiddleware;
