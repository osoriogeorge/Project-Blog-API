const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

exports.getAllCommentsForPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId) },
      include: { user: true },
    });
    res.json(comments);
  } catch (error) {
    console.error("Error al obtener los comentarios:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al obtener los comentarios." });
  }
};

exports.createComment = async (req, res) => {
  const { postId } = req.params; // Obtén postId desde los parámetros de la URL
  const { content, userId } = req.body;
  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId), // Usa el postId del parámetro de la URL
        userId: parseInt(userId),
      },
      include: { user: true },
    });
    res.status(201).json(newComment);
  } catch (error) {
    if (error.code === "P2003") {
      return res
        .status(400)
        .json({ error: "La publicación o el usuario especificado no existe." });
    }
    console.error("Error al crear el comentario:", error);
    res.status(500).json({ error: "Ocurrió un error al crear el comentario." });
  }
};

// Actualizar un comentario (requiere autenticación y ser el autor)
exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!comment) {
      return res.status(404).json({ error: "Comentario no encontrado." });
    }
    if (comment.userId !== userId) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para actualizar este comentario." });
    }
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
      include: { user: true },
    });
    res.json(updatedComment);
  } catch (error) {
    if (error.code === "P2016") {
      return res.status(404).json({ error: "Comentario no encontrado." });
    }
    console.error("Error al actualizar el comentario:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al actualizar el comentario." });
  }
};

// Eliminar un comentario (requiere autenticación y ser el autor)
exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!comment) {
      return res.status(404).json({ error: "Comentario no encontrado." });
    }
    if (comment.userId !== userId) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para eliminar este comentario." });
    }
    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2016") {
      return res.status(404).json({ error: "Comentario no encontrado." });
    }
    console.error("Error al eliminar el comentario:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al eliminar el comentario." });
  }
};
