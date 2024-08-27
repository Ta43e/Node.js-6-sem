var redis = require('redis');
var client = redis.createClient(); 
client.on('connect', () => { console.log('connected'); }); 