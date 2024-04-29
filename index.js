
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()


// middle Ware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fcxten6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)



const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();


        const spotsCollection = client.db('AsiaAdventureDB').collection('Adventure')

        // Push Data MongoDB
        app.post('/spots', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee)
            const result = await spotsCollection.insertOne(newCoffee);
            res.send(result)
        })

        // Read & Show Data Clint Side .
        app.get('/spots', async (req, res) => {
            const cursor = spotsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })



        // Find MyList Data With Email
        app.get('/myList/:email', async (req, res) => {
            // console.log(req.params.email)
            const result = await spotsCollection.find({email:req.params.email}).toArray();
            res.send(result)
        })



        // Update Page Show User Data
        app.get('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await spotsCollection.findOne(query);
            res.send(result)
        })


        // Update User Data .
        app.put('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const updateSpots = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const spot = {
                $set: {
                    photo: updateSpots.photo,
                    name: updateSpots.name
                },
            };

            const result = await spotsCollection.updateOne(filter, spot, options);
            res.send(result)

        })






        // Delete Single Data 
        app.delete('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await spotsCollection.deleteOne(query);
            res.send(result);
        })


        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);










app.get('/', (req, res) => {

    res.send(" Asia Adventure Server is Running")

})

app.listen(port, () => {

    console.log(`Asia Adventure Server is Running is on port :${port}`)

})