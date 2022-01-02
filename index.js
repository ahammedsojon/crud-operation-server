const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors');
const port = 5000;


// middleware
app.use(cors());
app.use(express.json());


// mydbuser2
// sDPTZ531aYYSyIrE

const uri = "mongodb+srv://mydbuser2:sDPTZ531aYYSyIrE@cluster0.a6jam.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("storeProducts");
        const productsCollection = database.collection("products");

        // GET API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find();
            const result = await cursor.toArray();
            res.json(result);
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);
            console.log("updating: ", id)
            res.json(result);
        })
        // POST API
        app.post('/products', async (req, res) => {
            const products = req.body;
            const doc = {
                name: products.name,
                quantity: products.quantity,
                price: products.price
            }
            const result = await productsCollection.insertOne(doc);
            console.log('hitting the post', req.body);
            console.log(result)
            res.json(result);
        })
        // DELETE API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            console.log('product id', id)
            console.log('delete result', result)
            res.json(result)
        })
        // PUT API
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const product = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: product.name,
                    quantity: product.quantity,
                    price: product.price
                },
            };
            const result = await productsCollection.updateOne(filter, updateDoc, options);
            console.log(result);
            res.json(result)
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running my node server");
})


app.listen(port, () => {
    console.log("listening to port: ", port);
})

