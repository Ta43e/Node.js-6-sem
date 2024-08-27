const redis = require("redis");
var client = redis.createClient();


console.time("setTestTime");

    client.set('incr’',  0);

console.timeEnd("setTestTime");

console.time("startIncr");
for (var i = 0; i < 10000; i++) {
    client.incr('incr’');
}
console.timeEnd("startIncr");

console.time("startDecr");
for (var i = 0; i < 10000; i++) {
    client.decr('incr’');
}
console.timeEnd("startDecr");