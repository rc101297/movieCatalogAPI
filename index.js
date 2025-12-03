// Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Environment Setup
require("dotenv").config();

// Routes importation
const userRoutes = require("./routes/users");
const movieRoutes = require("./routes/movies");

// Server Setup
const app = express();

app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:8000"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Database Connection
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas")
);

// Backend Routes
app.use("/users", userRoutes);
app.use("/movies", movieRoutes);

if (require.main === module && process.env.JWT_SECRET_KEY) {
  app.listen(process.env.PORT || 4000, () => {
    console.log(`API is now online on port ${process.env.PORT || 4000}`);
  });
}

module.exports = { app, mongoose };
