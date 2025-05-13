const { PrismaClient } = require("../../generated/prisma");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt"); // Para hashear contraseñas
const jwt = require("jsonwebtoken"); // Para crear JWTs
const prisma = new PrismaClient();

// Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, isAdmin } = req.body;

  // Validaciones básicas
  if (!username || typeof username !== "string" || username.trim() === "") {
    return res.status(400).json({
      error:
        "El nombre de usuario es requerido y debe ser una cadena de texto no vacía.",
    });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      error: "La contraseña es requerida y debe tener al menos 6 caracteres.",
    });
  }

  // isAdmin es opcional, pero si se proporciona, debe ser un booleano
  if (isAdmin !== undefined && typeof isAdmin !== "boolean") {
    return res
      .status(400)
      .json({ error: "isAdmin debe ser un valor booleano." });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: "El nombre de usuario ya existe." }); // 409 Conflict
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario en la base de datos
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        isAdmin: isAdmin !== undefined ? Boolean(isAdmin) : false,
      },
    });

    // No enviar la contraseña hasheada en la respuesta
    const { password: newUserPassword, ...userWithoutPassword } = newUser;

    res.status(201).json(userWithoutPassword); // 201 Created
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al registrar el usuario." });
  }
};

// Iniciar sesión de usuario y generar JWT
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Buscar al usuario por nombre de usuario
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas." }); // 401 Unauthorized
    }

    // Comparar la contraseña proporcionada con la contraseña hasheada en la base de datos
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales inválidas." }); // 401 Unauthorized
    }

    // Crear el JWT
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      "keloke",
      { expiresIn: "1h" }
    ); // ¡Reemplaza 'tu_secreto_seguro'!

    res.json({ token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Ocurrió un error al iniciar sesión." });
  }
};

// Eliminar un usuario por nombre de usuario (SOLO PARA DESARROLLO)
exports.deleteUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const deletedUser = await prisma.user.delete({
      where: { username },
    });
    if (deletedUser) {
      res
        .status(200)
        .json({ message: `Usuario '${username}' eliminado correctamente.` });
    } else {
      res
        .status(404)
        .json({ error: `No se encontró el usuario '${username}'.` });
    }
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ error: "Ocurrió un error al eliminar el usuario." });
  }
};
