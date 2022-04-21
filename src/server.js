const http = require('http');
const path = require('path');

const express = require('express');

const morgan = require('morgan');
const bodyParser = require('body-parser');

const createServer = (webRoot, routes) => {
    const app = express();

    app.use(morgan('combined', {
        stream: process.stdout,
    }));

    app.use(bodyParser({
        extended: true
    }));

    app.use(express.static(webRoot));

    app.get('/', (_, res) => {
        res.sendFile(path.join(webRoot, 'index.html'));
    });

    if (routes) routes(app);

    return http.createServer(app);
};

module.exports = { createServer };
