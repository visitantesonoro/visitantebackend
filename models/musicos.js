const mongoose = require("mongoose");

const musicoSchema = mongoose.Schema({
  nombre: { 
    type: String, 
    required: true 
  },
  imagen:{
    type:String,
    required:false
  },
  grabaciones: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Grabaciones'}]
});

module.exports = mongoose.model('Musicos', musicoSchema);
