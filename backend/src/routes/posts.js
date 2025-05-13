const express = require("express");
const router = express.Router();
const postController = require("../controllers/posts");
const authMiddleware = require("../middleware/auth"); // Asegúrate de que esta importación esté presente

// Obtener todas las publicaciones públicas (no requiere autenticación)
router.get("/posts", postController.getAllPublishedPosts);

// Obtener una publicación por ID (no requiere autenticación)
router.get("/posts/:id", postController.getPostById);

// Crear una nueva publicación (requiere autenticación)
router.post(
  "/posts",
  authMiddleware.isAuthenticated,
  postController.createPost
);

// Actualizar una publicación (requiere autenticación)
router.put(
  "/posts/:id",
  authMiddleware.isAuthenticated,
  postController.updatePost
);

// Eliminar una publicación (requiere autenticación)
router.delete(
  "/admin/posts/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  postController.deletePost
);

module.exports = router;
