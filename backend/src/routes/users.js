const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const userController = require("../controllers/users");
const authMiddleware = require("../middleware/auth");
const adminAuthMiddleware = require("../middleware/adminAuth");

// Ruta para registrar un nuevo usuario
router.post(
  "/auth/register",
  [
    body("username")
      .notEmpty()
      .isString()
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage(
        "El nombre de usuario es requerido y debe tener entre 3 y 50 caracteres."
      ),
    body("password")
      .notEmpty()
      .isString()
      .isLength({ min: 6 })
      .withMessage(
        "La contraseña es requerida y debe tener al menos 6 caracteres."
      ),
    body("isAdmin")
      .optional()
      .isBoolean()
      .withMessage("isAdmin debe ser un valor booleano."),
  ],
  userController.registerUser
);

// Ruta para iniciar sesión y obtener un JWT
router.post("/login", userController.loginUser);

// Ruta para eliminar un usuario por nombre de usuario (SOLO PARA DESARROLLO)
router.delete("/users/:username", userController.deleteUserByUsername);

module.exports = router;
