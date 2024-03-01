const express = require('express');
const { Worker, isMainThread } = require('worker_threads');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/non-blocking', (req, res) => {
    console.log('isMainThread--->', isMainThread);
    res.status(200).send('This page is non-blocking');
});

app.get('/blocking', (req, res) => {
    const worker = new Worker('./worker.js');
    worker.on('message', (data) => {
        console.log('data--->', data);
        res.status(200).send(`This result: ${data}`);
    });
    worker.on('error', (error) => {
        console.log('error--->', error);
        res.status(200).send(`An error occured: ${error}`);
    })
});

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
});