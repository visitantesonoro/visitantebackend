const { validationResult } = require("express-validator");
const Musico = require("../models/musicos");

async function traerMusicos(req, res, next) {
  const musicos = await Musico.find();

  res.json(musicos);
}

async function crearMusico(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json("Algun campo no está bien");
    return;
  }

  const { nombre, imagen } = req.body;

  const musico = new Musico({
    nombre,
    imagen,
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

  const id = req.params.id;

  let musicoDB;

  try {
    musicoDB = await Musico.findById(id);

    if (!musicoDB) {
      res.json("no encontramos el músico");

      return;
    }
  } catch (erros) {
    res.json("Algo ocurrió al momento de acceder a la base de datos");

    return;
  }

  const { nombre, imagen } = req.body;

  musicoDB.nombre = nombre;
  musicoDB.imagen = imagen;

  try {
    await musicoDB.save();
  } catch {
    res.json("falló la creación");
  }

  res.json(musicoDB);
}

async function borrarMusico(req, res, next){
    const id = req.params.id;

    console.log(id);

    try{
       await  Musico.findByIdAndDelete(id);

    }catch(error){
        res.json("algo ocurrió al tratar de borrar")
    }

    res.json("se borró el músico");
}

exports.traerMusicos = traerMusicos;
exports.crearMusico = crearMusico;
exports.editarMusico = editarMusico;
exports.borrarMusico = borrarMusico;
