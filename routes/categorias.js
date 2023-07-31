const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const categoriasController = require("../controllers/categorias");
const { check } = require('express-validator');

router.get("/", categoriasController.traerCategorias);

router.post("/crear", [
  check('titulo').not().isEmpty(),
], 
categoriasController.crearCategoria);

router.patch("/editar/:id", [
  check('titulo').not().isEmpty(),
], 
categoriasController.editarCategoria);

router.delete("/borrar/:id", categoriasController.borrarCategoria);

module.exports = router;
