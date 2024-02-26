const express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  uuid = require('uuid');

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

let users = [
  {
    id: 1,
    name: "Charlie",
    favoriteMovies: []
  },
    {
      id: 2,
    name: "Sam",
    favoriteMovies: ["The Empire Strikes Back"]
    }
]

let movies = [
    {
      "Title": 'The Big Lebowski',
      "Director": {
        "Name":"Joel Coen",
        "Bio":"Joel Daniel Coen (born November 29, 1954)[1] and Ethan Jesse Coen (born September 21, 1957),[2] collectively known as the Coen brothers (/ˈkoʊən/ KOH-ən), are an American filmmaking duo. Their films span many genres and styles, which they frequently subvert or parody.[3] Their most acclaimed works include Blood Simple (1984), Raising Arizona (1987), Miller's Crossing (1990), Barton Fink (1991), Fargo (1996), The Big Lebowski (1998), O Brother, Where Art Thou? (2000), No Country for Old Men (2007), A Serious Man (2009), True Grit (2010) and Inside Llewyn Davis (2013). Many of their films are distinctly American, often examining the culture of the American South and American West in both modern and historical contexts.",
        "Birth":1954.0
      },
        "Genre": {
        "Name":"Comedy",
        "Description":"A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh."
      }
    },
    {
       "Title": 'Rushmore',
       "Director": {
        "Name":"Wes Anderson",
        "Bio":"Wesley Wales Anderson (born May 1, 1969) is an American filmmaker. His films are known for their eccentricity, unique visual and narrative styles,[1] and frequent use of ensemble casts. They often contain themes of grief, loss of innocence, and dysfunctional families. Some critics cite Anderson as a modern-day example of an auteur. Three of his films[a] have appeared in BBC Culture's 2016 poll of the greatest films since 2000.",
        "Birth":1969.0
      },
       "Genre": {
        "Name":"Comedy",
        "Description":"A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh."
      }
     }, 
      {
      "Title": 'Dazed and Confused',
      "Director": {
        "Name":"Richard Linklater",
        "Bio":"Richard Stuart Linklater born July 30, 1960)[2] is an American film director, producer, and screenwriter. He is known for making films that deal thematically with suburban culture and the effects of the passage of time. His films include the comedies Slacker (1990) and Dazed and Confused (1993); the Before trilogy of romance films: Before Sunrise (1995), Before Sunset (2004), and Before Midnight (2013); the music-themed comedy School of Rock (2003); the adult animated films Waking Life (2001), A Scanner Darkly (2006), and Apollo 10 1⁄2: A Space Age Childhood (2022); the coming-of-age drama Boyhood (2014); and the comedy film Everybody Wants Some!! (2016).",
        "Birth":1960.0
      },
      "Genre": {
        "Name":"Comedy",
        "Description":"A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh."
      }
    },
    {
        "Title": 'Mean Streets',
        "Director": {
          "Name":"Martin Scorcese",
          "Bio":"Martin Charles Scorsese born November 17, 1942) is an American filmmaker. He emerged as one of the major figures of the New Hollywood era. Scorsese has received many accolades, including an Academy Award, four BAFTA Awards, three Emmy Awards, a Grammy Award, three Golden Globe Awards, and two Directors Guild of America Awards. He has been honored with the AFI Life Achievement Award in 1997, the Film Society of Lincoln Center tribute in 1998, the Kennedy Center Honor in 2007, the Cecil B. DeMille Award in 2010, and the BAFTA Fellowship in 2012. Five of his films have been inducted into the National Film Registry by the Library of Congress as culturally, historically or aesthetically significant.",
          "Birth":1942.0
        },
        "Genre": {
          "Name":"Comedy",
          "Description":"A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh."
        }
      },
      {
        "Title": 'The Empire Strikes Back',
        "Director": {
          "Name":"Irvin Kerschner",
          "Bio":"Irvin Kershner (born Isadore Kershner; April 29, 1923 – November 27, 2010) was an American director for film and television. Early in his career as a filmmaker he directed quirky, independent drama films, while working as a lecturer at the University of Southern California. Later, he transitioned to high-budget blockbusters such as The Empire Strikes Back, the James Bond adaptation Never Say Never Again and RoboCop 2. Through the course of his career, he received numerous accolades, including being nominated for both a Primetime Emmy Award and a Palme d'Or.",
          "Birth":1923.0
        },
        "Genre": {
          "Name":"SciFi",
          "Description":"Science fiction (or sci-fi or SF) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, mutants, interstellar travel, time travel, or other technologies. Science fiction films have often been used to focus on political or social issues, and to explore philosophical issues like the human condition."
        }
      }, 
      {
        "Title": 'Back to the Future',
        "Director": {
          "Name":"Robert Zemeckis",
          "Bio":"Robert Lee Zemeckis (born May 14, 1952)[3] is an American film director, producer, and screenwriter. He first came to public attention as the director of the action-adventure romantic comedy Romancing the Stone (1984), the science-fiction comedy Back to the Future trilogy (1985–1990), and the live-action/animated comedy Who Framed Roger Rabbit (1988). He subsequently directed the satirical black comedy Death Becomes Her (1992) and then diversified into more dramatic fare, including Forrest Gump (1994),[4] for which he won the Academy Award for Best Director. The film also won the Best Picture.",
          "Birth":1952.0
        },
        "Genre": {
          "Name":"Comedy",
          "Description":"A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh."
        }
      },
      {
        "Title": 'Jaws',
        "Director": {
          "Name":"Steven Speilberg",
          "Bio":"Steven Allan Spielberg born December 18, 1946) is an American film director, producer and screenwriter. A major figure of the New Hollywood era and pioneer of the modern blockbuster, he is the most commercially successful director in history.[1] He is the recipient of many accolades, including three Academy Awards, two BAFTA Awards, and four Directors Guild of America Awards, as well as the AFI Life Achievement Award in 1995, the Kennedy Center Honor in 2006, the Cecil B. DeMille Award in 2009 and the Presidential Medal of Freedom in 2015. Seven of his films have been inducted into the National Film Registry by the Library of Congress as culturally, historically or aesthetically significant.",
          "Birth":1946.0
        },
        "Genre": {
          "Name":"Comedy",
          "Description":"A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh."
        }
      },
      {
        "Title": 'The Kid Stays in the Picture',
        "Director": {
          "Name":"Brett Morgen",
          "Bio":"Brett D. Morgen (born October 11, 1968)[1] is an American documentary filmmaker. His directorial credits include The Kid Stays in the Picture (2002), Crossfire Hurricane (2012), Kurt Cobain: Montage of Heck (2015), Jane (2017), and Moonage Daydream (2022).",
          "Birth":1968.0
        },
        "Genre": {
          "Name":"Comedy",
          "Description":"A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh."
        }
      },
      {
        "Title": 'Stop Making Sense',
        "Director": {
          "Name":"Jonathan Demme",
          "Bio":"Robert Jonathan Demme, February 22, 1944 to April 26, 2017) was an American filmmaker, whose career directing, producing, and screenwriting spanned more than 30 years and 70 feature films, documentaries, and television productions. He was an Academy Award and a Directors Guild of America Award winner, and received nominations for a BAFTA Award, a Golden Globe Award, and three Independent Spirit Awards.",
          "Birth":1944.0
        },
        "Genre": {
          "Name":"Comedy",
          "Description":"A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh."
        }
      },
      {
        "Title": 'Boogie Nights',
        "Director": {
          "Name":"Paul Thomas Anderson",
          "Bio":"Paul Thomas Anderson (born June 26, 1970), also known by his initials PTA, is an American filmmaker. His accolades include nominations for eleven Academy Awards, three Golden Globe Awards, and eight BAFTA Awards (winning one for Best Original Screenplay). He has also won Best Director at the Cannes Film Festival, the Silver Lion at the Venice Film Festival, and both the Silver and Golden Bear at the Berlin Film Festival.",
          "Birth":1970.0
        },
        "Genre": {
          "Name":"Comedy",
          "Description":"A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh."
        }

      } 
];


// CREATE
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need names')
  }
})

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
  
  // listening for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

  