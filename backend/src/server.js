const express = require("express");
const passport = require("passport"); // Importa Passport
require("./middleware/passport-config"); // Importa la configuración de Passport
const app = express();
const port = 3000;

const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const userRoutes = require("./routes/users");

// Middleware para analizar el cuerpo de las peticiones JSON
app.use(express.json());

// Inicializa Passport
app.use(passport.initialize());

// Usar las rutas
app.use("/api", postRoutes);
app.use("/api", commentRoutes);
app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
  res.send("¡Hola desde tu backend!");
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
