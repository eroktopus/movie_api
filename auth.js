const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); 


let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, 
    expiresIn: '7d', // token will expire in 7 days
    algorithm: 'HS256' // algorithm to sign or encode the values of the JWT
  });
}


/* POST login. */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (!user) {
        console.log('Authentication failed:', info.message);
        return res.status(401).json({ message: info.message });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          console.error('Login error:', error);
          return res.status(500).json({ message: 'Internal server error' });
        }
        console.log('User logged in successfully:', user.Username);
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}