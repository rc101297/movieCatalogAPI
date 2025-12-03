// Dependencies and Modules
const express = require("express");
const movieController = require("../controllers/movies.js");
const { verify, verifyAdmin, isLoggedIn } = require("../auth.js");

//Routing Component
const router = express.Router();

// Add Movie
router.post("/addMovie", verify, verifyAdmin, movieController.addMovie);

// Get All Movies
router.get("/getMovies", movieController.getAllMovies);

// Get the Movie
router.get("/getMovie/:movieId", movieController.getMovieById);

// Update the Movie
router.patch(
  "/updateMovie/:movieId",
  verify,
  verifyAdmin,
  movieController.updateMovie
);

// Delete Movie
router.delete(
  "/deleteMovie/:movieId",
  verify,
  verifyAdmin,
  movieController.deleteMovieById
);

// Add comments to the movie
router.patch("/addComment/:movieId", verify, movieController.addMovieComment);

// Get Comments from a movie
router.get("/getComments/:movieId", verify, movieController.getMovieComments);

module.exports = router;
