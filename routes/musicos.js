const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const musicosController = require("../controllers/musicos");
const { check } = require('express-validator');

router.get("/", musicosController.traerMusicos)

router.post("/crear", [
  check('nombre').not().isEmpty(),
  check('imagen').not().isEmpty(),
], 
musicosController.crearMusico);

router.patch("/editar/:id", [
  check('nombre').not().isEmpty(),
  check('imagen').not().isEmpty(),
], 
musicosController.editarMusico);

router.delete("/borrar/:id", musicosController.borrarMusico);

module.exports = router;
