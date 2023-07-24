const mongoose = require("mongoose");

const grabacionSchema = mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  fecha: {
    type: Date,
    required: true,
  },
  fechaPublicacion: {
    type: Date,
    required: true,
    default: Date.now,
  },
  lugar: {
    type: String,
    required: true,
  },
  longitud: {
    type: String,
    required: true,
  },
  latitud: {
    type: String,
    required: true,
  },
  musico: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref: 'Musicos'
  },
});

module.exports = mongoose.model("Grabaciones", grabacionSchema);