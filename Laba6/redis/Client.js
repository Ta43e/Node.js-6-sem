const redis = require('redis');

const redisClient = redis.createClient(); 
redisClient.on('connect', () => { console.log('connected'); }); 

module.exports = redisClient;
