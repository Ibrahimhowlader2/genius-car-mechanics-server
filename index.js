const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

require("dotenv").config();


const app = express()
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjj4l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("mechanics");
        const serviceCollection = database.collection("services");

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('his the post', service);
            const result = await serviceCollection.insertOne(service);
            // console.log(service);
            res.send(result);

        })


    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running genius server')
})

app.listen(port, () => {
    console.log('Running genius server on port', port);
})