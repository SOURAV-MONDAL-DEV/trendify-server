const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(cors());0
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ihuwgkj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run(){

   try{


      const usersCollection = client.db('trendify').collection('users');





      app.get('/users/:id', async (req, res) => {
         const email = req.params.id;
         const query = { email: email };
         const cursor = await usersCollection.find(query);
         const user = await cursor.toArray();

         res.send(user);
     })



      app.post('/users', async (req, res) => {
         const user = req.body;
         const result = await usersCollection.insertOne(user);
         res.send(result);
     })



     app.put('/users/:id', async (req, res) => {
      const email = req.params.id;
      const query = { email: email };
      const user = req.body;
      console.log(user.email);
      const options = { upsert: true };
      const updatedUser = {
          $set: {
              name: user.name,
              email: user.email,
          }
      }
      if (user.email) {
          const result = await usersCollection.updateOne(query, updatedUser, options);
          res.send(result);
      }

  })



   }
   finally{

   }


}


run().catch(err => console.error(err));


app.get('/', async(req, res) => {
   res.send("our server ok running");
})

app.listen(port, () => console.log(`trendify running ${port}`))
