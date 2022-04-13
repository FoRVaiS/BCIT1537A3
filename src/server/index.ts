import path from 'path';

import config from 'config';
import mongoose from 'mongoose';

import { createServer } from './server.js';
import * as model from './models/index.js';

import { Post } from 'comp1537a3';

(async () => {
    const port = parseInt(config.get<string>('server.port') ?? '5000', 10);
    const host = config.get<string>('server.host') ?? '0.0.0.0';

    const mongoHost = config.get<string>('mongo.host');
    const mongoPort = config.get<string>('mongo.port');
    const mongoDb = config.get<string>('mongo.database');
    const mongoUser = config.get<string>('mongo.user');
    const mongoPass = config.get<string>('mongo.password');

    const webRoot = path.join(process.cwd(), 'public');

    mongoose.connect(`mongodb://${mongoHost}:${mongoPort}/${mongoDb}`, {
        user: mongoUser,
        pass: mongoPass,
    });

    const server = createServer(webRoot, app => {
        app.post<any, any, any, Post.FindByName>('/find/name', async (req, res) => {
            const { name } = req.body;

            const result = await model.unicorns.find({ name });

            res.status(200).json(result);
        });

        app.post<any, any, any, Post.FindByWeight>('/find/weight', async (req, res) => {
            const { lower, upper } = req.body;

            const result = await model.unicorns.find({
                $and: [
                    { weight: { $gt: lower } },
                    { weight: { $lt: upper } }
                ]
            });

            res.status(200).json(result);
        });

        app.post<any, any, any, Post.FindByFood>('/find/food', async (req, res) => {
            const { foods } = req.body;

            const loves = foods.map(food => ({
                loves: { $in: [food] },
            }))
            try {
                const result = await model.unicorns.find({ $and: loves });

                res.status(200).json(result);
            } catch {
                res.status(500).send("Can not pass an empty array");
            }
        });
    });

    server.listen(port, host, () => {
        console.log(`Server starting on ${host}:${port}.`);
    });
})();
