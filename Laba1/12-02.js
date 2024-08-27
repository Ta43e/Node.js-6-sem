const redis = require("redis");

var client = redis.createClient();

console.time("setTestTime");
for(var i=0; i < 10000; i++ ) {
    client.set(i,  `set${i}`);
}
console.timeEnd("setTestTime");

console.time("getTestTime");
for(var i=0; i < 10000; i++ ) {
  client.get(i);
}
console.timeEnd("getTestTime");

console.time("delTestTime");
for(var i=0; i < 10000; i++ ) {
    client.del(i);
}
console.timeEnd("delTestTime");
