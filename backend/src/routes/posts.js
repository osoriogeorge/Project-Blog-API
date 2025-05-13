const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const postController = require("../controllers/posts");
const authMiddleware = require("../middleware/auth");
const adminAuthMiddleware = require("../middleware/adminAuth");

// Obtener todas las publicaciones públicas (no requiere autenticación)
router.get("/posts", postController.getAllPublishedPosts);

// Obtener una publicación por ID (no requiere autenticación)
router.get("/posts/:id", async (req, res, next) => {
  try {
    await postController.getPostById(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Crear una nueva publicación (requiere autenticación)
router.post(
  "/posts",
  authMiddleware.isAuthenticated,
  [
    body("authorId")
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("El authorId debe ser un número entero positivo."),
    body("title")
      .notEmpty()
      .isString()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage(
        "El título es requerido y debe tener entre 1 y 255 caracteres."
      ),
    body("slug")
      .notEmpty()
      .isString()
      .trim()
      .isSlug() // Puedes usar isSlug() para validar un formato de slug
      .isLength({ min: 1, max: 255 })
      .withMessage(
        "El slug es requerido, debe ser una cadena válida y tener entre 1 y 255 caracteres."
      ),
    body("content")
      .notEmpty()
      .isString()
      .trim()
      .isLength({ min: 1 })
      .withMessage("El contenido es requerido."),
    body("isPublished")
      .optional() // No es requerido
      .isBoolean()
      .withMessage("isPublished debe ser un valor booleano."),
  ],
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
  //authMiddleware.isAdmin,
  postController.deletePost
);

module.exports = router;
