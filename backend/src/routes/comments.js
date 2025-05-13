const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comments");
const authMiddleware = require("../middleware/auth"); // Asegúrate de que esta importación esté presente

// Obtener todos los comentarios de una publicación (no requiere autenticación)
router.get("/posts/:postId/comments", commentController.getAllCommentsForPost);

// Crear un nuevo comentario (no requiere autenticación, si quieres permitir comentarios anónimos)
router.post("/posts/:postId/comments", commentController.createComment);

// Eliminar un comentario (requiere autenticación)
router.delete(
  "/comments/:id",
  authMiddleware.isAuthenticated,
  commentController.deleteComment
);

// Actualizar un comentario (requiere autenticación)
router.put(
  "/comments/:id",
  authMiddleware.isAuthenticated,
  commentController.updateComment
);

module.exports = router;
