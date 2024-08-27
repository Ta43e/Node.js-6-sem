const express = require('express');
const session = require('express-session');
const passport = require('passport');
const parser = require('body-parser');
const GitHubStrategy = require('passport-github2').Strategy;
const app = express();

app.use(session({
        secret:'Oleg',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        },
    })
)
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, next) => {
    next(null, user);
})

passport.deserializeUser((user, next) => {
    next(null, user);
})

passport.use(new GitHubStrategy({
    clientID: "4b84c5bbdce586184c9d",
    clientSecret: "cb8402fc8e12fcfbea07134ac3cc143ee40c03b3",
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, next) {
    next(null, profile);
  }
));

app.use(parser.json());

const isAuth = (req, res, next) => {
    if(req.user) {
        next();
    }
    else {
        res.redirect('/login')
    }
}

app.get('/', (req, res) => {
    res.redirect('resource');
})

app.get('/auth/github/', passport.authenticate('github'));

app.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
    res.redirect('/');
})

app.get('/resource', isAuth, (req, res) => {
    const userData = {
        username: req.user._json.login,
        id: req.user.id
    };
    console.log(req.user);
    req.session.userData = userData;

    res.sendFile(__dirname + '/resource.html');
})

app.get('/login', (req, res) => {
    if(req.user) {
      return  res.redirect('/');
    }
    res.sendFile(__dirname + '/index.html');
})

app.get('/getUserData', isAuth, (req, res) => {
    res.send(req.session.userData);
});


    app.get('/logout', (req, res) => {
        req.logOut(() => {
            req.session.destroy(() => {
                req.user = null;
                res.redirect('/login');
            });
        });
    });

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.listen(3000, ()=> {
    console.log(`http://localhost:3000/login`)
})