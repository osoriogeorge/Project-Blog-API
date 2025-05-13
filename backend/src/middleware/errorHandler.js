const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log del error para depuración en el servidor

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Usa el código de estado existente o establece un 500 por defecto
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Mostrar stack solo en desarrollo
  });
};

module.exports = errorHandler;
