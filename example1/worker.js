const { parentPort, isMainThread} = require('worker_threads');

console.log('isMainThread--->', isMainThread);

let counter = 0;
for (let i = 0; i < 20000000000; i++) {
    counter++;
}

parentPort.postMessage(counter);