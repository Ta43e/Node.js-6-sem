const express = require('express');
const session = require('express-session');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const user = require("./users.json") || [];
const bodyParser = require("body-parser");
const flash = require('connect-flash');

const app = express();

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(bodyParser.json());
app.use(express.static('view'));
app.use(passport.initialize());
app.use(passport.session());



passport.use(new LocalStrategy(
    (username, passport, done) => {

        const users = user.find(user => user.name === username && user.password === passport);
        console.log(users);
        if (users) {
            return done(null, users);
        }
        else {
            return done(null, false, {message: 'Usern dont find'});
        }
    }
));

passport.serializeUser((user, done) => {
    console.log(user.name);
    done(null, user.name)
})

passport.deserializeUser((name, done) => {
    const users = user.find(user => user.name === name);
    done(null, users);
})
app.get('/login', (req, res) => {
    res.sendFile('index.html', { root: 'view' });
});

app.post('/login', 
    passport.authenticate('local', {
        successRedirect: '/resource',
        failureRedirect: '/login',
        failureFlash: true
    })
);

app.get('/resource', (req, res) => {
    if (req.isAuthenticated()) {
        console.log('fff');
        res.json({message:  `RESOURCE  ${req.user.name}`});
    } else {
        console.log('ddd');
        res.status(401).redirect('/login');
    }
})

app.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        // Успешный выход из сеанса
        res.redirect('/login');
    });
});


app.use((req, res) => {
    res.status(404).send('Not found');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});