const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const sub = redisClient.duplicate();

// function fib(index) {
//     if (index < 2) {
//         return 1
//     }
//     else {
//         value = [1,1]
//         for (i=2; i < index+1; i++) {
//             value.push(value[i-1] + value[i-2])
//         }
//         return value.pop()
//     }
// }

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
