const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const crearAdmin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.json("hay errores en la creación");
    return;
  }

  const { email, password } = req.body;

  const adminDB = await Admin.findOne({ email: email });

  if(adminDB){
    res.json("El usuario ya existe");

    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = new Admin({
    email,
    password:hashedPassword
  });

  try {
    await admin.save();
  } catch (error) {
    console.log(error);
  }

  res.json(admin);
};

const login = async(req, res)=>{

  const { email, password } = req.body;

  const usuarioDB = await Admin.findOne({ email: email });

  if (!usuarioDB) {
    res.json("No esiste el usuario");
    return;
  }

  const passwordBueno = bcrypt.compare(password, usuarioDB.password);

  if (!passwordBueno) {
    res.json("El password está mal");
    return;
  }

  let token;

  try{
    token = jwt.sign({ userId: usuarioDB._id }, "clave_secreta", {
      expiresIn: "1h",
    });
  }catch(error){
    console.log(error);
    return;
  }

  const adminData = {
    id: usuarioDB._id,
    email: usuarioDB.email,
    token,
  };

  res.json({ adminData });
}

exports.crearAdmin = crearAdmin;
exports.login = login;
