const express = require('express');
const app = express();
const cors = require('cors');
// const jwt = require('jsonwebtoken');

require('dotenv').config()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mhlikac.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const classCollection = client.db("singerella").collection("classes");
    const instructorCollection = client.db("singerella").collection("instructors");
    const enrolledCollection = client.db("singerella").collection("enrolled");
    const usersCollection = client.db("singerella").collection("users");

    
//post users
      app.post('/users', async (req, res) => {
        console.log('Received POST request at /users');
  console.log('Request body:', req.body);

        const user = req.body;
         const query = { email: user.email }
        const existingUser = await usersCollection.findOne(query);
  
        if (existingUser) {
          return res.send({ message: 'user already exists' })
        }
  
        const result = await usersCollection.insertOne(user);
        console.log('User inserted:', result);
        res.send(result);
      });

   
    
    
    app.get('/users', async (req, res) => {
        const result = await usersCollection.find().toArray();
        res.send(result);
      })


      app.patch('/users/admin/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            role: 'admin'
          },
        };
  
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.send(result);
  
      });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

// get classes data
    app.get('/classes', async (req, res) => {
        const result = await classCollection.find().toArray();
        res.send(result);
      })
// get instructor data
      app.get('/instructors', async (req, res) => {
        const result = await instructorCollection.find().toArray();
        res.send(result);
      })

      app.get('/enrolled', async (req, res) => {
        const result = await enrolledCollection.find().toArray();
        res.send(result);
      })



      //  collection apis
   
      app.delete('/enrolled/:_id', async (req, res) => {
        const id = req.params._id;
        const query = { _id: new ObjectId(id) };
        const result = await enrolledCollection.deleteOne(query);
        res.send(result);
        console.log(result)
      })

      app.post('/enrolled', async (req, res) => {
        const item = req.body;
        console.log(item);
        const result = await enrolledCollection.insertOne(item);
        res.send(result);
      })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('singerrela is working')
  })
  
  app.listen(port, () => {
    console.log(`singerella is sitting on port ${port}`);
  })
