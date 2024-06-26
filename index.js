const express = require("express");
const cors = require("cors");
// const { MongoClient } = require('mongodb');
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Models = require("./models.js");

const app = express();
const passport = require("passport");
require("./passport");

const { check, validationResult } = require("express-validator");

const Genre = require("./models.js").Genre;
const Director = require("./models.js").Director;
const Movie = require("./models.js").Movie;
const User = Models.User;

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.connect('mongodb://localhost:27017/mfDB', { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose.connect('mongodb://localhost:27017/mfDB');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(cors());

let auth = require("./auth")(app);

// Create a new user
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = User.hashPassword(req.body.Password);
    await User.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          User.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // CONDITION TO CHECK ADDED HERE
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }
    // CONDITION ENDS
    await User.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Read all movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const movies = await Movie.find();
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).send("Error: " + error);
    }
  }
);

// Read all users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).send("Error: " + error);
    }
  }
);

// Get a user by username
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findOne({ Username: req.params.Username });
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.json(user);
    } catch (error) {
      res.status(500).send("Error: " + error);
    }
  }
);

// Add a movie to a user's list of favorites
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { Username: req.params.Username },
        { $push: { FavoriteMovies: req.params.MovieID } },
        { new: true }
      );
      res.json(updatedUser);
    } catch (error) {
      res.status(500).send("Error: " + error);
    }
  }
);

// Get a user's favorite movies
app.get(
  "/users/:Username/favorite-movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findOne({ Username: req.params.Username });
      if (!user) {
        return res.status(404).send("User not found");
      }
      // Assuming your User schema has a field called FavoriteMovies which stores an array of movie IDs
      const favoriteMovies = await Movie.find({
        _id: { $in: user.FavoriteMovies },
      });
      res.status(200).json(favoriteMovies);
    } catch (error) {
      res.status(500).send("Error: " + error);
    }
  }
);

// Remove a movie from a user's list of favorites
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { Username: req.params.Username },
        { $pull: { FavoriteMovies: req.params.MovieID } },
        { new: true }
      );
      res.json(updatedUser);
    } catch (error) {
      res.status(500).send("Error: " + error);
    }
  }
);

// Delete a user by username
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const deletedUser = await User.findOneAndDelete({
        Username: req.params.Username,
      });
      if (!deletedUser) {
        return res.status(404).send("User not found");
      }
      res.status(200).send(req.params.Username + " was deleted.");
    } catch (error) {
      res.status(500).send("Error: " + error);
    }
  }
);

app.get("/movies/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const movie = await Movie.findOne({
      Title: { $regex: "^" + title + "$", $options: "i" },
    });
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    console.log("Found movie:", movie); // Log the movie object if found
    res.status(200).json(movie); // Respond with the movie object
  } catch (error) {
    res.status(500).send("Error: " + error);
  }
});

app.get("/genres/:genreName", async (req, res) => {
  try {
    const genreName = req.params.genreName;

    // Find the genre object by name
    const genre = await Genre.findOne({ Name: genreName });

    if (!genre) {
      return res.status(404).send("Genre not found");
    }

    // Send the genre object
    res.status(200).json(genre);
  } catch (error) {
    res.status(500).send("Error: " + error);
  }
});

app.get("/directors/:directorName", async (req, res) => {
  try {
    const directorName = req.params.directorName;

    // Find the director object by name
    const director = await Director.findOne({ Name: directorName });

    if (!director) {
      return res.status(404).send("Director not found");
    }

    // Send the director object
    res.status(200).json(director);
  } catch (error) {
    res.status(500).send("Error: " + error);
  }
});

// GET requests
app.get("/", (req, res) => {
  res.send("myFlix are bester than yours!");
});

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
