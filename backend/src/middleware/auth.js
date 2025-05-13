const passport = require("passport");

exports.isAuthenticated = passport.authenticate("jwt", { session: false });

// Middleware para verificar si el usuario es un administrador
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ error: "Acceso no autorizado." }); // 403 Forbidden
};
