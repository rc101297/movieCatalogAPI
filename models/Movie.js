const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is Required"],
  },

  director: {
    type: String,
    required: [true, "Director name is Required"],
  },

  year: {
    type: String,
    required: [true, "Year Released is Required"],
  },

  description: {
    type: String,
    required: [true, "Movie Description is Required"],
  },

  genre: {
    type: String,
    required: [true, "Movie Genre is Required"],
  },
  comments: [
    {
      userId: {
        type: String,
        required: [true, "User ID is Required"],
      },
      comment: {
        type: String,
        required: [true, "Your comment is Required"],
      },
    },
  ],
});

module.exports = mongoose.model("Movie", movieSchema);
