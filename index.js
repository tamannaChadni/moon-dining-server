const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
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
