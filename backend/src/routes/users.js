const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

// Ruta para registrar un nuevo usuario
router.post("/register", userController.registerUser);

// Ruta para iniciar sesión y obtener un JWT
router.post("/login", userController.loginUser);

// Ruta para eliminar un usuario por nombre de usuario (SOLO PARA DESARROLLO)
router.delete("/users/:username", userController.deleteUserByUsername);

module.exports = router;
