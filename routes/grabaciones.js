const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Grabacion = require("../models/grabacion");

const Musico = require("../models/musicos");

router.get("/", (req, res) => {
  res.json("Acá irían todas las grabaciones");
});

router.post("/crear", async (req, res) => {
  const {
    titulo,
    descripcion,
    fecha,
    fechaPublicacion,
    lugar,
    longitud,
    latitud,
    musico,
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
  })

});

module.exports = router;
