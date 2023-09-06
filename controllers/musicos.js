const fs = require("fs");
const { validationResult } = require("express-validator");
const Musico = require("../models/musico");
const Grabacion = require("../models/grabacion");

async function traerMusicos(req, res, next) {
  const musicos = await Musico.find();

  res.json(musicos);
}

async function traerMusico(req, res, next) {
  let musico;

  try {
    musico = await Musico.findById(req.params.id);

    if (!musico) {
      res.json("no encontramos el músico");
      return;
    }
  } catch (error) {
    res.json("Algo ocurrió al momento de acceder a la base de datos");
    return;
  }

  let grabaciones;

  try {
    grabaciones = await Grabacion.find({ musico: musico._id });
  } catch (error) {
    res.json(
      "Algo ocurrió y no se puedo acceder a la base de datos y a las grabaciones"
    );
  }

  const data ={
    musico,
    grabaciones
  }

  res.json(data);
}

async function crearMusico(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json("Algun campo no está bien");
    return;
  }
  const { nombre, descripcion } = req.body;

  const musico = new Musico({
    nombre,
    imagen: req.file ? req.file.path : "",
    descripcion,
  });

  try {
    await musico.save();
  } catch {
    res.json("falló la creación");
  }

  res.json(musico);
}

async function editarMusico(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json("Algun campo no está bien");
    return;
  }

  let musicoDB;

  try {
    musicoDB = await Musico.findById(req.params.id);

    if (!musicoDB) {
      res.json("no encontramos el músico");
      return;
    }
  } catch (error) {
    res.json("Algo ocurrió al momento de acceder a la base de datos");
    return;
  }

  const imgA = musicoDB.imagen;

  const { nombre, descripcion } = req.body;

  musicoDB.nombre = nombre;
  musicoDB.imagen = req.file ? req.file.path : musicoDB.imagen;
  musicoDB.descripcion = descripcion;

  try {
    await musicoDB.save();
  } catch {
    res.json("falló la creación");
    return;
  }

  if (req.file) {
    fs.unlink(imgA, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  res.json(musicoDB);
}

async function borrarMusico(req, res, next) {
  let grabaciones;

  try {
    grabaciones = await Grabacion.find({ musico: req.params.id });
  } catch (error) {
    console.log(error);
  }

  if (grabaciones.length > 0) {
    res.json(false);
    return;
  }

  let musicoDB;

  try {
    musicoDB = await Musico.findById(req.params.id);

    if (!musicoDB) {
      res.json("no encontramos el músico");
      return;
    }
  } catch (error) {
    res.json("Algo ocurrió al momento de acceder a la base de datos");
    return;
  }

  fs.unlink(musicoDB.imagen, (err) => {
    if (err) {
      console.log(err);
    }
  });

  try {
    await Musico.findByIdAndDelete(req.params.id);
  } catch (error) {
    res.json("algo ocurrió al tratar de borrar");
  }

  res.json("se borró el músico");
}

exports.traerMusicos = traerMusicos;
exports.traerMusico = traerMusico;
exports.crearMusico = crearMusico;
exports.editarMusico = editarMusico;
exports.borrarMusico = borrarMusico;
