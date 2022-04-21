const path = require('path');

const mongoose = require('mongoose');

const { createServer } = require('./server.js');
const model = require('./models/index.js');

(async () => {
    const host = process.env.HOST ?? '0.0.0.0';
    const port = parseInt(process.env.PORT ?? '8000', 10) ;
    const webRoot = path.join(process.cwd(), 'public');

    mongoose.connect(`mongodb+srv://admin:1qSTXB61jI6WdTAM@bcit1537.guwup.mongodb.net/BCIT1537`);

    const server = createServer(webRoot, app => {
        app.post('/find/name', async (req, res) => {
            const { name } = req.body;
            const result = await model.unicorns.find({ name });
            res.status(200).json(result);
        });

        app.post('/find/weight', async (req, res) => {
            const { lower, upper } = req.body;
            const result = await model.unicorns.find({
                $and: [
                    { weight: { $gt: lower } },
                    { weight: { $lt: upper } }
                ]
            });
            res.status(200).json(result);
        });

        app.post('/find/food', async (req, res) => {
            const { foods } = req.body;
            const loves = foods.map(food => ({
                loves: { $in: [food] },
            }));
            try {
                const result = await model.unicorns.find({ $and: loves });
                res.status(200).json(result);
            }
            catch {
                res.status(500).send("Can not pass an empty array");
            }
        });
    });

    server.listen(port, host, () => {
        console.log(`Server starting on ${host}:${port}.`);
    });
})();
