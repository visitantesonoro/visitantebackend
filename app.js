// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const musicosRouter = require("./routes/musicos");
const grabacionesRouter = require("./routes/grabaciones");
const categoriasRouter = require("./routes/categorias");
const tagsRouter = require("./routes/tags");
const adminRouter = require("./routes/admin");
const path = require("path");

const app = express();

app.use(bodyParser.json());
// app.use("/public", express.static(path.join(__dirname, "./public/")));
// app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/admin/musicos/", musicosRouter);
app.use("/admin/grabaciones/", grabacionesRouter);
app.use("/admin/categorias/", categoriasRouter);
app.use("/admin/tags/", tagsRouter);
app.use("/admin/administradores/", adminRouter);

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => {
  console.log("conecto al database");
});

app.listen(process.env.PORT || 4200);
