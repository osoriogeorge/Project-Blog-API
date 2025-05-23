const express = require("express");
const passport = require("passport");
require("./middleware/passport-config");

const errorHandler = require("./middleware/errorHandler");
const app = express();
const port = 3000;

const helmet = require("helmet");
const cors = require("cors");

const morgan = require("morgan");

const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const userRoutes = require("./routes/users");

// Middleware para analizar el cuerpo de las peticiones JSON
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(morgan("dev"));

app.use(passport.initialize());

// Usar las rutas
app.use("/api", postRoutes);
app.use("/api", commentRoutes);
app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
  res.send("¡Hola desde tu backend!");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

module.exports = app;
