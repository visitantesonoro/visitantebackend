const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const tagController = require("../controllers/tags");
const { check } = require('express-validator');

router.get("/", tagController.traerTags);

router.post("/crear", [
  check('titulo').not().isEmpty(),
], 
tagController.crearTag);

router.patch("/editar/:id", [
  check('titulo').not().isEmpty(),
], 
tagController.editarTag);

router.delete("/borrar/:id", tagController.borrarTag);

module.exports = router;
