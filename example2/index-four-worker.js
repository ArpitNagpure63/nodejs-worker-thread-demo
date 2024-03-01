const express = require('express');
const { Worker } = require('worker_threads');

const app = express();
const PORT = process.env.PORT || 3000;
const THREAD_COUNT = 4;

app.get('/non-blocking', (req, res) => {
    res.status(200).send('This page is non-blocking');
});

const createWorker = () => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./four-worker.js', { workerData: { thread_count: THREAD_COUNT } });
        worker.on('message', (data) => {
            console.log('data--->', data);
            resolve(data);
        });
        worker.on('error', (error) => {
            console.log('error--->', error);
            reject(`Error ${error}`);
        })
    })
};

app.get('/blocking', async (req, res) => {
    const wokerPromises = [];
    let result = 0;

    for (let i = 0; i < THREAD_COUNT; i++) {
        wokerPromises.push(createWorker());
    };

    const thread_result = await Promise.all(wokerPromises);
    console.log('thread_result--->', thread_result);

    for (let i = 0; i < thread_result.length; i++) {
        result += thread_result[i];
    };
    
    console.log('result--->', result);
    res.status(200).send(`This result: ${result}`);
});

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
});