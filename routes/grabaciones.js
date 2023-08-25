const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const grabacionController = require("../controllers/grabaciones");
const { check } = require("express-validator");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const MIME_TYPE_MAP = {
  "audio/mpeg": "mp3",
};

const fileUpload = multer({
  limits: 5000000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/uploads/audios");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];

      const id = crypto.randomUUID();
      const lastIndex = file.originalname.lastIndexOf(".");
      const fileN = file.originalname.slice(0, lastIndex);

      const name = `${fileN}-${id}.${ext}`;

      cb(null, name);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];

    let error = isValid ? null : "invalido";

    cb(error, isValid);
  },
});

router.get("/", grabacionController.traerGrabaciones);
router.get("/:id", grabacionController.traerGrabacion);
router.post("/crear", grabacionController.crearGrabacion);
router.patch("/editar/:id", fileUpload.single("audio"), grabacionController.editarGrabacion);
router.delete("/borrar/:id", grabacionController.borrarGrabacion);

module.exports = router;
