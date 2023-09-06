const mongoose = require("mongoose");
const fs = require("fs");
const { validationResult } = require("express-validator");
const Grabacion = require("../models/grabacion");
const Musico = require("../models/musico");
const Categoria = require("../models/categoria");
const Tag = require("../models/tag");

async function traerGrabaciones(req, res, next) {
  const grabaciones = await Grabacion.find({});
  const musicos = await Musico.find({});
  const categorias = await Categoria.find({});
  const tags = await Tag.find({});

  const info = {
    musicos,
    grabaciones,
    categorias,
    tags,
  };

  res.json(info);
}

async function traerGrabacion(req, res, next) {
  const id = req.params.id;

  let grabacion;

  try{
    grabacion = await Grabacion.findById(id);
  }catch(error){
    res.json(false)
    return;
  }

  const musicos = await Musico.find({});
  const categorias = await Categoria.find({});
  const tags = await Tag.find({});

  const info = {
    musicos,
    grabacion,
    categorias,
    tags,
  };

  res.json(info);
}

async function crearGrabacion(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json("Algun campo no está bien");
    return;
  }

  const {
    titulo,
    descripcion,
    interpretes,
    fecha,
    fechaPublicacion,
    lugar,
    longitud,
    latitud,
    musico,
    categoria,
    tags,
  } = req.body;

  let tagsDB = JSON.parse(tags);
  let fechaDB = JSON.parse(fecha);

  const grabacion = await new Grabacion({
    titulo,
    descripcion,
    interpretes,
    fecha: fechaDB,
    fechaPublicacion,
    lugar,
    longitud,
    latitud,
    musico,
    categoria,
    tags:tagsDB,
    audio:req.file.path
  });

  try {
    await grabacion.save();
  } catch {
    res.json("falló la creación de la grabación");
    return;
  }

  res.json(grabacion);
}

async function editarGrabacion(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json("Algun campo no está bien");
    return;
  }

  const id = req.params.id;

  const {
    titulo,
    descripcion,
    interpretes,
    fecha,
    lugar,
    longitud,
    latitud,
    musico,
    categoria,
    tags,
  } = req.body;

  let tagsDB = JSON.parse(tags);
  let fechaDB = JSON.parse(fecha);

  let grabacion;

  try {
    grabacion = await Grabacion.findById(id);

    if (!grabacion) {
      res.json("no encontramos la grabación");
      return;
    }
  } catch (e) {
    res.json("Algo ocurrió al momento de acceder a la base de datos");
    return;
  }

  const audioA = grabacion.audio;

  grabacion.titulo = titulo;
  grabacion.descripcion = descripcion;
  grabacion.interpretes = interpretes;
  grabacion.fecha = fechaDB;
  grabacion.lugar = lugar;
  grabacion.longitud = longitud;
  grabacion.latitud = latitud;
  grabacion.musico = musico;
  grabacion.categoria = categoria;
  grabacion.tags = tagsDB;
  grabacion.audio = req.file ? req.file.path : grabacion.audio;

  try {
    await grabacion.save();
  } catch {
    res.json("falló la creación de la grabación");
    return;
  }

  if (req.file) {
    fs.unlink(audioA, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  res.json(grabacion);
}

async function borrarGrabacion(req, res, next) {
  const id = req.params.id;

  let grabacion;

  try{
    grabacion = await Grabacion.findById(id);

    if(!grabacion){
      res.json("La grabación ya no existe en la base de datos");
    }

  }catch(error){
    console.log(error);
    res.json("Algo ocurrió al tratar de borrar")
  }

  const audio = grabacion.audio;  

  fs.unlink(audio, (err) => {
    if (err) {
      console.log(err);
    }
  });

  try {
    await Grabacion.findByIdAndDelete(id);
  } catch (error) {
    res.json("algo ocurrió al tratar de borrar");
  }

  res.json("se borró la grabación");
}

exports.traerGrabaciones = traerGrabaciones;
exports.crearGrabacion = crearGrabacion;
exports.traerGrabacion = traerGrabacion;
exports.editarGrabacion = editarGrabacion;
exports.borrarGrabacion = borrarGrabacion;
