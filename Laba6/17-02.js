const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const {checkAuth, heandleValidationErrors}  = require('./utils/index.js');
const {register, login, refreshToken, logout, resource, checkLsit, flushdb} =  require('./controlles/UserController.js')
const mongoose = require('mongoose');
const {TokenVerifyingMiddleware} =  require('./midlewares/index.js')


mongoose
    .connect(`mongodb://127.0.0.1:27017/labaToken`)
    .then( () => { console.log('OK')})
    .catch((err) => { console.log(`error: ${err}`)});

const app = express();
app.use(express.static('view'));
app.use(cookieParser());

app.use(bodyParser.json());

app.get('/login', (req, res) => {
    res.sendFile('index.html', { root: 'view' });
});
app.post('/login',login)
app.get('/refreshToken', refreshToken);

app.get('/resource', TokenVerifyingMiddleware, resource)
app.get('/logout', logout)
app.post('/register', register);
app.get('/checkLsit', checkLsit);
app.get('/flushdb', flushdb);
app.get('/register', (req, res) => {
    res.sendFile('register.html', { root: 'view' });
});

app.use((req, res) => {
    res.status(404).send('Not found');
});




app.use((req, res) => {
    res.status(404).send('Not found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});