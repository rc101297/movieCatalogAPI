//Dependencies and Modules
const Movie = require("../models/Movie.js");
const { errorHandler } = require("../auth.js");

// Add Movie
module.exports.addMovie = async (req, res) => {
  try {
    // Validations
    if (!req.user) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    if (!req.user.isAdmin) {
      return res.status(403).send({ message: "Access denied. Admins only." });
    }

    // const { name, description, price, stocks } = req.body;
    const { title, director, year, description, genre } = req.body;

    if (!title || !director || !year || !description || !genre) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const existingMovie = await Movie.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
    });

    if (existingMovie) {
      return res
        .status(409)
        .send({ message: "Movie with the same title already exists" });
    }

    const newMovie = new Movie({
      title,
      director,
      year,
      description,
      genre,
    });

    await newMovie.save();
    res.status(201).send(newMovie);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
};

// Get all Movies
module.exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).send({ movies: movies });
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
};

// Get movie by ID
module.exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);

    if (!movie) {
      return res.status(404).send({ message: "Movie not found" });
    }

    return res.status(200).send(movie);
  } catch (err) {
    errorHandler(err, req, res);
  }
};

// Update the Movie
module.exports.updateMovie = (req, res) => {
  // Validations
  if (!req.user) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  if (!req.user.isAdmin) {
    return res.status(403).send({ message: "Access denied. Admins only." });
  }

  let updatedMovie = {
    title: req.body.title,
    director: req.body.director,
    year: req.body.year,
    description: req.body.description,
    genre: req.body.genre,
  };

  return Movie.findByIdAndUpdate(req.params.movieId, updatedMovie, {
    new: true,
  })
    .then((movie) => {
      if (movie) {
        res.status(200).send({
          message: "Movie updated successfully",
          updatedMovie: movie,
        });
      } else {
        res.status(404).send({ message: "Movie not found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Delete Movie
module.exports.deleteMovieById = (req, res) => {
  // Validations
  if (!req.user) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  if (!req.user.isAdmin) {
    return res.status(403).send({ message: "Access denied. Admins only." });
  }

  return Movie.findByIdAndDelete(req.params.movieId)
    .then((movie) => {
      if (movie) {
        return res.status(200).send({
          message: "Movie deleted successfully",
        });
      } else {
        return res.status(404).send({ message: "Movie not found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Add comments to the Movie
module.exports.addMovieComment = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    // Validate input
    const { comment } = req.body;
    if (!comment || comment.trim() === "") {
      return res.status(400).send({ message: "Comment is required" });
    }

    // Check if movie exists and if user already commented
    const existingMovie = await Movie.findOne({
      _id: req.params.movieId,
      "comments.userId": req.user.id,
    });

    if (existingMovie) {
      return res.status(400).send({
        message: "You have already commented on this movie",
      });
    }

    let addedComment = {
      comment: req.body.comment,
      userId: req.user.id,
    };

    return Movie.findByIdAndUpdate(
      req.params.movieId,
      { $push: { comments: addedComment } },
      {
        new: true,
      }
    )
      .then((movie) => {
        if (movie) {
          res.status(200).send({
            message: "comment added successfully",
            updatedMovie: movie,
          });
        } else {
          res.status(404).send({ message: "Movie not found" });
        }
      })
      .catch((error) => errorHandler(error, req, res));
  } catch (error) {
    console.log(error);
    errorHandler(error, req, res);
  }
};

// Get comments by movieId
module.exports.getMovieComments = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);

    if (!movie) {
      return res.status(404).send({ message: "Movie not found" });
    }

    // Return only the comments array
    return res.status(200).send({
      comments: movie.comments || [],
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};
