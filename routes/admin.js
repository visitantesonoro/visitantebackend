const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminController = require("../controllers/admin");

router.post("/crear", [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
],
adminController.crearAdmin);

router.post("/login", adminController.login)

module.exports = router;