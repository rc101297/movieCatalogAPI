//Dependencies and Modules
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const auth = require("../auth.js");
const { errorHandler } = require("../auth.js");
const jwt = require("jsonwebtoken");

//User Registration and checking for duplicate emails and mobile number
module.exports.register = async (req, res) => {
  try {
    if (!req.body.email.includes("@")) {
      return res.status(400).send({ message: "Email invalid" });
    } else if (req.body.password.length < 8) {
      return res
        .status(400)
        .send({ message: "Password must be atleast 8 characters" });
    }

    // duplicate emails validation
    const existingUser = await User.findOne({
      $or: { email: req.body.email },
    });

    if (existingUser) {
      return res.status(400).send({ message: "Email already registered" });
    }

    const newUser = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    await newUser.save();

    return res.status(201).send({
      message: "Registered Successfully",
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

//User Login
module.exports.login = async (req, res) => {
  try {
    if (!req.body.email.includes("@")) {
      return res.status(400).send({ message: "Email invalid" });
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({ message: "Email not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).send({ message: "Incorrect email or password" });
    }

    return res.status(200).send({
      access: auth.createAccessToken(user),
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};
