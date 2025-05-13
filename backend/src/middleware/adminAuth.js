const jwt = require("jsonwebtoken");

const isAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({
          error: "Acceso denegado. Se requieren privilegios de administrador.",
        });
    }
    next();
  } catch (error) {
    res.status(400).json({ error: "Token inválido." });
  }
};

module.exports = isAdmin;
