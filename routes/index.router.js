const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");
const ctrlUser = require("../controllers/user.controller");

router.post("/register", ctrlUser.register);
router.post("/login", ctrlUser.login);

module.exports = router;
