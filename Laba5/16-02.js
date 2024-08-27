const express = require('express');
const {DigestStrategy} = require('passport-http');
const passport = require("passport");
const method = require('./method/method.js');
const controller = require('./controllers/controllers.js');
const session = require('express-session');


const app = express();


passport.use('digest', new DigestStrategy(
    {qop: 'auth'},
    (username, done) => {
        const user = method.getUser(username);

        if (user) {
            return done(null, user, user.password);
        }

        return done(null, false);

    }
));

app.use(express.json());
app.use(passport.initialize());

app.use(session({
  secret: 'poka',
  resave: false,
  saveUninitialized: false
}));

app.get('/login', (req, res, next) => controller.login(req, res, next), passport.authenticate('digest', {session: false, successRedirect: '/resource'}));
app.get('/logout', (req, res, next) => controller.logout(req, res, next))
app.get('/resource',  passport.authenticate('digest', {session: false, failureRedirect: "/login"}), (req, res, next) => controller.resource(req, res, next))

  app.use((req, res) => {
    res.status(404).send('Not found');
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});