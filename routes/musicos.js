const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const musicosController = require("../controllers/musicos");
const { check } = require("express-validator");
const multer = require("multer");
const crypto = require("crypto");


const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({ 
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/uploads/musicos');
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

router.get("/", musicosController.traerMusicos);

router.post(
  "/crear",
  fileUpload.single("imagen"),
  [check("nombre").not().isEmpty()],
  musicosController.crearMusico
);

router.patch(
  "/editar/:id",
  fileUpload.single("imagen"),
  [check("nombre").not().isEmpty()],
  musicosController.editarMusico
);

router.delete("/borrar/:id", musicosController.borrarMusico);

module.exports = router;
