const express = require('express');
const {BasicStrategy} = require('passport-http');
const passport = require("passport");
const method = require('./method/method.js');
const controller = require('./controllers/controllers.js');
const session = require('express-session');


const app = express();

passport.use('basic', new BasicStrategy (

  (username, password, done) => {

      const userHasCredential = method.checkUser(username, password);

      return done(null, userHasCredential ? username : false);

  }
));

app.use(express.json());
app.use(passport.initialize());

app.use(session({
  secret: 'privet',
  resave: false,
  saveUninitialized: false
}));

app.get('/login',  controller.login(req, res, next), passport.authenticate('basic', {session: false, successRedirect: '/resource'}));
app.get('/logout',  controller.logout(req, res, next))
app.get('/resource',  passport.authenticate('basic', {session: false, failureRedirect: "/login"}), controller.resource(req, res, next))

  app.use((req, res) => {
    res.status(404).send('Not found');
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});