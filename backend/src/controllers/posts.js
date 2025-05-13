const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

// Obtener todas las publicaciones públicas
exports.getAllPublishedPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      include: { author: true, comments: true },
    });
    res.json(posts);
  } catch (error) {
    console.error("Error al obtener las publicaciones:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al obtener las publicaciones." });
  }
};

// Obtener una publicación por ID
exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: { author: true, comments: { include: { user: true } } },
    });
    if (!post) {
      return res.status(404).json({ error: "Publicación no encontrada." });
    }
    res.json(post);
  } catch (error) {
    console.error("Error al obtener la publicación:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al obtener la publicación." });
  }
};

// Crear una nueva publicación (requiere autenticación)
exports.createPost = async (req, res) => {
  const { authorId, title, slug, content, isPublished } = req.body;

  // Validaciones básicas
  if (
    !authorId ||
    typeof authorId !== "number" ||
    !Number.isInteger(authorId) ||
    authorId <= 0
  ) {
    return res.status(400).json({
      error: "El authorId es requerido y debe ser un número entero positivo.",
    });
  }

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      error: "El título es requerido y debe ser una cadena de texto no vacía.",
    });
  }

  if (!slug || typeof slug !== "string" || slug.trim() === "") {
    return res.status(400).json({
      error: "El slug es requerido y debe ser una cadena de texto no vacía.",
    });
  }

  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({
      error:
        "El contenido es requerido y debe ser una cadena de texto no vacía.",
    });
  }

  // isPublished es opcional, pero si se proporciona, debe ser un booleano
  if (isPublished !== undefined && typeof isPublished !== "boolean") {
    return res
      .status(400)
      .json({ error: "isPublished debe ser un valor booleano." });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        authorId,
        title,
        slug,
        content,
        isPublished: isPublished !== undefined ? isPublished : false,
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    if (error.code === "P2003") {
      return res
        .status(400)
        .json({ error: "El autor especificado no existe." }); // 400 Bad Request
    }
    console.error("Error al crear la publicación:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al crear la publicación." });
  }
};

// Actualizar una publicación existente (requiere autenticación y ser el autor)
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, slug, content, isPublished } = req.body;
  const userId = req.user.id; // El ID del usuario autenticado (gracias al middleware)
  try {
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
    if (!post) {
      return res.status(404).json({ error: "Publicación no encontrada." });
    }
    // ... actualizar la publicación ...
  } catch (error) {
    if (error.code === "P2016") {
      return res.status(404).json({ error: "Publicación no encontrada." });
    }
    console.error("Error al actualizar la publicación:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al actualizar la publicación." });
  }
};

// Eliminar una publicación (requiere autenticación y ser el autor, O ser administrador)
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const isAdmin = req.user.isAdmin;
  try {
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
    if (!post) {
      return res.status(404).json({ error: "Publicación no encontrada." });
    }
    if (post.authorId !== userId && !isAdmin) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para eliminar esta publicación." });
    }
    await prisma.post.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar la publicación:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al eliminar la publicación." });
  }
};
