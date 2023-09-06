const mongoose = require("mongoose");

const musicoSchema = mongoose.Schema({
  nombre: { 
    type: String, 
    required: true 
  },
  url:{
    type:String,
    required:false
  },
  descripcion:{
    type:String,
    required:false
  },
  imagen:{
    type:String,
    required:false
  }
});

module.exports = mongoose.model('Musicos', musicoSchema);
