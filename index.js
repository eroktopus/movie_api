const express = require('express');
// const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');

const passport = require('passport');
require('./passport');

const { check, validationResult } = require('express-validator');

const Genre = require('./models.js').Genre;
const Director = require('./models.js').Director;
const Movie = require('./models.js').Movie;
const User = Models.User;

const app = express();

mongoose.connect('process.env.CONNECTION_URI'), { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose.connect('mongodb://localhost:27017/mfDB', { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose.connect('mongodb://localhost:27017/mfDB');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth')(app);

// Create a new user
app.post('/users',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = User.hashPassword(req.body.Password);
    await User.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          User
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  // CONDITION TO CHECK ADDED HERE
  if(req.user.Username !== req.params.Username){
      return res.status(400).send('Permission denied');
  }
  // CONDITION ENDS
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
      }
  },
      { new: true }) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
          res.json(updatedUser);
      })
      .catch((err) => {
          console.log(err);
          res.status(500).send('Error: ' + err);
      })
});

// Read all movies
app.get('/movies', passport.authenticate('jwt', { session: false }),async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});

// Read all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});

// Get a user by username
app.get('/users/:Username', async (req, res) => {
  try {
    const user = await User.findOne({ Username: req.params.Username });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});

// Update a user's info, by username
app.put('/users/:Username', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});

// Remove a movie from a user's list of favorites
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});

// Delete a user by username
app.delete('/users/:Username', async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ Username: req.params.Username });
    if (!deletedUser) {
      return res.status(404).send('User not found');
    }
    res.status(200).send(req.params.Username + ' was deleted.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});

app.get('/movies/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const movie = await Movie.findOne({ Title: { $regex: '^' + title + '$', $options: 'i' } });
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    console.log('Found movie:', movie); // Log the movie object if found
    res.status(200).json(movie); // Respond with the movie object
  } catch (error) {
    console.error('Error:', error); // Log any database query errors
    res.status(500).send('Error: ' + error);
  }
});

app.get('/genres/:genreName', async (req, res) => {
  try {
    const genreName = req.params.genreName;

    // Find the genre object by name
    const genre = await Genre.findOne({ Name: genreName });

    if (!genre) {
      return res.status(404).send('Genre not found');
    }

    // Send the genre object
    res.status(200).json(genre);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error: ' + error);
  }
});


app.get('/directors/:directorName', async (req, res) => {
  try {
    const directorName = req.params.directorName;

    // Find the director object by name
    const director = await Director.findOne({ Name: directorName });

    if (!director) {
      return res.status(404).send('Director not found');
    }

    // Send the director object
    res.status(200).json(director);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error: ' + error);
  }
});

//UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id );

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user')
  }
})
  
  //CREATE
  app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );
  
    if (user) {
      user.favoriteMovies.push(movieTitle);
      res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
      res.status(400).send('no such user')
    }
  })

  //DELETE
  app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );
  
    if (user) {
      user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
      res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
      res.status(400).send('no such user')
    }
  })

   //DELETE
   app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id );
  
    if (user) {
      users = users.filter( user => user.id != id);
      res.status(200).send(` user ${id} has been deleted `);
    } else {
      res.status(400).send('no such user')
    }
  })

  // GET requests
  app.get('/', (req, res) => {
    res.send('myFlix are better than yours!');
  });
  
  //read
  app.get('/movies', (req, res) => {
    res.status(200).json(movies);
  });

  //READ
  app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.Title === title);

    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send('no such movie')
    }
  });

  //READ
  app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(400).send('no movies found for the specific genre')
    }
  });

  //READ
  app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName).Director;

    if (director) {
      res.status(200).json(director);
    } else {
      res.status(400).send('no movies found for the specific director')
    }
  });

  app.get('/users', (req, res) => {
    res.json(users);
  });
  
  app.use(express.static('public'));

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
  const port = process.env.PORT || 8080;
  app.listen(port, '0.0.0.0',() => {
   console.log('Listening on Port ' + port);
  });


  // // listening for requests
  // app.listen(8080, () => {
  //   console.log('Your app is listening on port 8080.');
  // });



