const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
require('dotenv').config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

//middleaware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.EM_NAM}:${process.env.EM_PASS}@cluster0.aiyi0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const employeeCollection = client.db("employeesDB").collection("empoyees")
const employeeAuthCollection = client.db("employeesauthDB").collection("employeesauth")

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    app.get("/employees", async (req, res) => {
      const cursor = employeeCollection.find()
      const result = await cursor.toArray()
      res.send(result);
    });

    app.get('/employees/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await employeeCollection.findOne(query);
      res.send(result);
    })

    app.post('/employees', async(req, res) =>{
      const employee = req.body
      // console.log(employee)
      const result = await employeeCollection.insertOne(employee)
      // console.log( result)
    })

    app.put('/employees/:id', async(req, res)=>{
      const id = req.params.id;
      const options = {upsert: true}
      const query = {_id: new ObjectId(id)}
      const employee = {
        $set: req.body
      }
      const result = await employeeCollection.updateOne(query, employee, options)
      // console.log(result)
    })

    app.delete('/employees/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await employeeCollection.deleteOne(query)
      // console.log(result)
    })


    //-----------------------------------------


    //  Authentication user information Api

    app.get('/employeesauth', async(req, res)=> {
      const cursor1 = employeeAuthCollection.find()
      const result = await cursor1.toArray()
      res.send(result)
    })

    app.get('/employeesauth/:id', async(req, res)=> {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await employeeAuthCollection.findOne(query)
      res.send(result)
    })

    app.post('/employeesauth', async(req, res)=>{
      const newUser = req.body
      const result = await employeeAuthCollection.insertOne(newUser)
      res.send(result)
    })

    app.patch('/employeesauth', async(req, res) => {
      const email = req.body.email
      const filter = {email}
      const updatedoc = {
        $set:{
          lastSingInTime: req.body?.lastSingInTime
        }
      }
      const result = await employeeAuthCollection.updateOne(filter, updatedoc)
      res.send(result)
      console.log(result)

    })

    app.delete('/employeesauth/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await employeeAuthCollection.deleteOne(query)
      console.log(result)
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


app.listen(port, () => {
  console.log("Employee server PORT", port);
});



