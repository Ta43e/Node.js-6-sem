const redis = require("redis");
var client = redis.createClient();

console.time("hsetTestTime");
for(var i=0; i < 10000; i++ ) {
    client.hset(i,  i, `val-${i}`, () => {});
}
console.timeEnd("hsetTestTime");

console.time("hgetTestTime");
for(var i=0; i < 10000; i++ ) {
    client.hget(i,  i);
}
console.timeEnd("hgetTestTime");