const  express = require('express');
const app = express();
const https = require('https');
const fs = require("fs");

const port = 3010;

let options =
{
    key: fs.readFileSync('LAB.KEY'),
    passphrase: 'key1',
    cert: fs.readFileSync('LAB.crt')
};

app.get('/', (req, res) =>
{
    res.send("hello from https")
});

https.createServer(options, app).listen(port, () =>
{
    console.log(`https://KOD:${port}/)`);
});