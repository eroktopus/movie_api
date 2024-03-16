const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const movieSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: [{ type: Schema.Types.ObjectId, ref: 'Genre', required: true }],
  Director: {
      Name: String,
      Bio: String
  },
  Actors: [{ type: String }],
  ImagePath: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

const genreSchema = new Schema({
  Name: { type: String, required: true }
}, { collection: 'genres' });

const directorSchema = new Schema({
  Name: { type: String, required: true }
}, { collection: 'directors' });

const Movie = mongoose.model('Movie', movieSchema);

Movie.findById(movieId)
  .populate('Genre') // Replace Genre ID with Genre document
  .populate('Director') // Replace Director ID with Director document
  .exec((err, movie) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(movie);
  });
  
const User = mongoose.model('User', userSchema);
const Genre = mongoose.model('Genre', genreSchema);
const Director = mongoose.model('Director', directorSchema); // Fixed model name

module.exports = { Movie, User, Genre, Director };
