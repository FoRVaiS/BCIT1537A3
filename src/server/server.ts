import http from 'http';
import path from 'path';

import express, { Express } from 'express';

import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';

type TCreateServer = (
    views: string,
    routes?: (app: Express) => void
) => ReturnType<typeof http['createServer']>

export const createServer: TCreateServer = (webRoot, routes) => {
    const app = express();

    // app.use(helmet());
    app.use(morgan('combined', {
        stream: process.stdout,
    }));
    app.use(bodyParser({
        extended: true
    }))

    app.use(express.static(webRoot));

    app.get('/', (_, res) => {
        res.sendFile(path.join(webRoot, 'index.html'));
    });

    if (routes) routes(app);

    return http.createServer(app);
};
