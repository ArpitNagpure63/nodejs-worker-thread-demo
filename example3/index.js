const { Worker } = require('worker_threads');

const chunkify = (array, n) => {
    let chunks = [];
    for (let i = n; i > 0; i--) {
        chunks.push(array.splice(0, Math.ceil(array.length / i)));
    }
    return chunks;
}

const run = (jobs, concurrentWorkers) => {
    const chunks = chunkify(jobs, concurrentWorkers);
    const tick = performance.now();
    let completedWorkers = 0;

    chunks.forEach((data, i) => {
        const worker = new Worker('./worker.js');
        worker.postMessage(data);
        worker.on('message', (data) => {
            console.log(`Worker ${i} completed`);
            completedWorkers++;
            if (completedWorkers === concurrentWorkers) {
                console.log(`${concurrentWorkers} Worker took ${performance.now()}`);
                process.exit();
            };
        })
    })
};

const jobs = Array.from({length: 100}, () => 1e9);
run(jobs, 16)