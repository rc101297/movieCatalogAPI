// Dependencies and Modules
const express = require("express");
const userController = require("../controllers/users");
const { verify, verifyAdmin, isLoggedIn } = require("../auth.js");

//Routing Component
const router = express.Router();

// Register
router.post("/register", userController.register);

// Login
router.post("/login", userController.login);

module.exports = router;
