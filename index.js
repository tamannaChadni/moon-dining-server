const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const cookieParser = require ('cookie-parser');

const corsOptions ={
  origin:["http://localhost:5173","https://moon-dining.web.app/"],
  credentials: true,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.avbafwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const resturantCollection = client.db("resturant").collection("foods");
    const purchaseCollection = client.db("resturant").collection("purchase");
    const galleryCollection = client.db("resturant").collection("gallery");

    // jwt generate

    app.post('/jwt', async(req,res)=>{
      const user = req.body
      const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn:'365d'})
      // res.send({token})
      res.cookie('token',token,{
        httpOnly:true,
        secure: process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV ==="production" ?'none':'strict',
      }).send({success:true})
    })

   












    // gallery api

    app.post("/gallery", async (req, res) => {
      const galleryFood = req.body;
      // console.log(newFood);
      const result = await galleryCollection.insertOne(galleryFood);
      res.send(result);
    });

    app.get("/gallery", async (req, res) => {
      const cursor = galleryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // purchase food

    app.post("/purchase", async (req, res) => {
      const purchaseFood = req.body;
      // console.log(newFood);
      const result = await purchaseCollection.insertOne(purchaseFood);
      res.send(result);
    });

    app.get("/purchase", async (req, res) => {
      const cursor = purchaseCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/purchase/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await purchaseCollection.deleteOne(query);
      res.send(result);
    });

    // resturant api

    app.get("/foods/search", async (req, res) => {
      const search = req.query.search;
      let query = {
        name: { $regex: search, $options: "i" },
      };
      const result = await resturantCollection
        .find(query)
        .toArray();
      res.send(result);
    });





    app.get("/foods", async (req, res) => {
      const cursor = resturantCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await resturantCollection.findOne(query);
      res.send(result);
    });

    app.post("/foods", async (req, res) => {
      const newFood = req.body;
      // console.log(newFood);
      const result = await resturantCollection.insertOne(newFood);
      res.send(result);
    });

    app.get("/users/:email/foods", async (req, res) => {
      console.log(req.params.email);
      const result = await resturantCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
      // res.send({ hi: "Hii" });
    });

    app.put("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateFood = req.body;

      const foods = {
        $set: {
          name: updateFood.name,
          image: updateFood.image,
          quantity: updateFood.quantity,
          category: updateFood.category,
          price: updateFood.price,
          country: updateFood.country,
          description: updateFood.description,
        },
      };

      const result = await resturantCollection.updateOne(
        filter,
        foods,
        options
      );
      res.send(result);
    });

    // resturant api

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("resturant server is running");
});

app.listen(port, () => {
  console.log(`resturant: ${port}`);
});
