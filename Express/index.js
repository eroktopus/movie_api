const express = require('express');
  morgan = require('morgan');

const app = express();

let topMovies = [
    {
      title: 'The Big Lebowski',
      director: 'Joel Coen'
    },
    {
       title: 'Rushmore',
       director: 'Wes Anderson'
      }, 
      {
      title: 'Dazed and Confused',
      director: 'Richard Linklater'
    },
    {
        title: 'Mean Streets',
        director: 'Martin Scorcese'
      },
      {
        title: 'The Empire Strikes Back',
        director: 'Irvin Kirshner'
      }, 
      {
        title: 'Back to the Future',
        director: 'Robert Zemeckis'
      },
      {
        title: 'Jaws',
        director: 'Steven Speilberg'
      },
      {
        title: 'The Kid Stays in the Picture',
        director: 'Nanette Burstein and Brett Morgen'
      },
      {
        title: 'Stop Making Sense',
        director: 'Jonathan Demme'
      },
      {
        title: 'Boogie Nights',
        director: 'Paul Thomas Anderson'
      } 
];

  
  // GET requests

  app.use(morgan('common'));

  app.get('/', (req, res) => {
    res.send('myFlix are better than yours!');
  });
  
  app.get('/movies', (req, res) => {
    res.json(topMovies);
  });
  
  app.use(express.static('public'));

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
  // listening for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

  