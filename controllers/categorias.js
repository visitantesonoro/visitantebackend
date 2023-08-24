const fs = require("fs");
const { validationResult } = require("express-validator");
const Categoria = require("../models/categoria");

async function traerCategorias(req, res, next) {
  const categorias = await Categoria.find();

  res.json(categorias);
}

async function crearCategoria(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json("Algun campo no está bien");
    return;
  }
  const { titulo, imagen, descripcion } = req.body;

  const categoria = new Categoria({
    titulo,
    imagen,
    descripcion
  });

  try {
    await categoria.save();
  } catch {
    res.json("falló la creación");
  }

  res.json(categoria);
}

async function editarCategoria(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json("Algun campo no está bien");
    return;
  }

  const id = req.params.id;

  let categoriaDB;

  try {
    categoriaDB = await Categoria.findById(id);

    if (!categoriaDB) {
      res.json("no encontramos la categoría");

      return;
    }
  } catch (error) {
    res.json("Algo ocurrió al momento de acceder a la base de datos");

    return;
  }

  const imgA = categoriaDB.imagen;

  console.log(imgA);

  const { titulo, descripcion } = req.body;

  categoriaDB.titulo = titulo;
  categoriaDB.imagen = req.file.path;;
  categoriaDB.descripcion = descripcion;

  try {
    await categoriaDB.save();
  } catch {
    res.json("falló la creación");
  }

  fs.unlink(imgA, (err) => {
    console.log(err);
  });

  res.json(categoriaDB);
}

async function borrarCategoria(req, res, next) {
  const id = req.params.id;

  try {
    await Categoria.findByIdAndDelete(id);
  } catch (error) {
    res.json("algo ocurrió al tratar de borrar");
  }

  res.json("se borró la categoria");
}

exports.traerCategorias = traerCategorias;
exports.crearCategoria = crearCategoria;
exports.editarCategoria = editarCategoria;
exports.borrarCategoria = borrarCategoria;
