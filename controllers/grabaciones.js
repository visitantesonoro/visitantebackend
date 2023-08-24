const mongoose = require("mongoose");
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
    tags
  }

  res.json(info);
}

async function traerGrabacion(req, res, next) {

  const id = req.params.id;

  const grabacion = await Grabacion.findById(id);
  const musicos = await Musico.find({})
  const categorias = await Categoria.find({});
  const tags = await Tag.find({});

  const info = {
    musicos,
    grabacion,
    categorias,
    tags
  }

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
    fecha,
    fechaPublicacion,
    lugar,
    longitud,
    latitud,
    musico,
    categoria,
    tags,
    audio
  } = req.body;

  const grabacion = new Grabacion({
    titulo,
    descripcion,
    fecha: new Date(fecha),
    fechaPublicacion,
    lugar,
    longitud,
    latitud,
    musico,
    categoria,
    tags,
    audio
  });

  let musicoDB;
  try {
    musicoDB = await Musico.findById(musico);
  } catch (err) {
    res.json("algo sucedio al tratar de traer el músico");
    return;
  }

  if (!musicoDB) {
    res.json("No se encontró el músico");
    return;
  }

  try {
    await grabacion.save();
  } catch {
    res.json("falló la creación de la grabación");
  }

  res.json(grabacion);
}

async function editarGrabacion(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json("Algun campo no está bien");
    return;
  }

  console.log(req.params);

  const id = req.params.id

  const {
    titulo,
    descripcion,
    fecha,
    lugar,
    longitud,
    latitud,
    musico,
    categoria,
    tags,
    audio
  } = req.body;

  const grabacion = await Grabacion.findById(id);
  grabacion.titulo = titulo;
  grabacion.descripcion = descripcion;
  grabacion.fecha = fecha;
  grabacion.lugar = lugar;
  grabacion.longitud = longitud;
  grabacion.latitud = latitud;
  grabacion.musico = musico;
  grabacion.categoria = categoria;
  grabacion.tags = tags;
  grabacion.audio = audio;

  let musicoDB;
  try {
    musicoDB = await Musico.findById(musico);
  } catch (err) {
    res.json("algo sucedio al tratar de traer el músico");
    return;
  }

  if (!musicoDB) {
    res.json("No se encontró el músico");
    return;
  }

  try {
    await grabacion.save();
  } catch {
    res.json("falló la creación de la grabación");
  }

  console.log(grabacion);

  res.json(grabacion);
} 

async function borrarGrabacion(req, res, next){
  const id = req.params.id;

  console.log(id);

  try{
     await  Grabacion.findByIdAndDelete(id);

  }catch(error){
      res.json("algo ocurrió al tratar de borrar")
  }

  res.json("se borró la grabación");
}

exports.traerGrabaciones = traerGrabaciones;
exports.crearGrabacion = crearGrabacion;
exports.traerGrabacion = traerGrabacion;
exports.editarGrabacion = editarGrabacion;
exports.borrarGrabacion = borrarGrabacion;
