const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const grabacionController = require("../controllers/grabaciones");

router.get("/", grabacionController.traerGrabaciones);
router.get("/:id", grabacionController.traerGrabacion);

router.post("/crear", grabacionController.crearGrabacion);
router.patch("/editar/:id", grabacionController.editarGrabacion);
router.delete("/borrar/:id", grabacionController.borrarGrabacion);

module.exports = router;
