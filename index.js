const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(cors()); 0
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ihuwgkj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {

   try {


      const usersCollection = client.db('trendify').collection('users');
      const postsCollection = client.db('trendify').collection('posts');
      const likesCollection = client.db('trendify').collection('likes');
      const commentsCollection = client.db('trendify').collection('comments');





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
               userPhoto: user.userPhoto,
            }
         }
         if (user.email) {
            const result = await usersCollection.updateOne(query, updatedUser, options);
            res.send(result);
         }

      })



      app.post('/posts', async (req, res) => {
         const posts = req.body;
         const result = await postsCollection.insertOne(posts);
         res.send(result);
      })





      app.get('/posts/popular', async (req, res) => {
         const query = {};
         const sort = { likeCount: -1 };
         const limit = 3;
         const cursor = await postsCollection.find(query).sort(sort).limit(limit);
         const user = await cursor.toArray();

         res.send(user);
      })



      app.get('/posts/new', async (req, res) => {
         const query = {};
         const sort = { postingDate: -1 };
         const limit = 3;
         const cursor = await postsCollection.find(query).sort(sort).limit(limit);
         const user = await cursor.toArray();

         res.send(user);
      })




      app.put('/posts', async (req, res) => {
         const postId = req.body.id;
         const increase = req.body.increase;
         const query = {_id: ObjectId(postId)};
         const options = { upsert: true };
         
            console.log(increase);
        
            const result = await postsCollection.updateOne( query,{ $inc: {likeCount: increase }},);
            res.send(result);
         

      })






      app.get('/isLiked', async (req, res) => {
         const email = req.query.email;
         const postId = req.query.postId;

         const query = { userEmail: email, postId: postId }

         const cursor = await likesCollection.findOne(query);

         res.send(cursor);
      })



      app.post('/likes', async (req, res) => {
         const likes = req.body;
         const result = await likesCollection.insertOne(likes);
         res.send(result);
      })



      app.delete('/likes', async (req, res) => {
         const email = req.body.userEmail;
         const postId = req.body.postId;

         const query = { userEmail: email, postId: postId }

         console.log(query);

         const result = await likesCollection.deleteOne(query);

         if (result.deletedCount === 1) {
            console.log("Successfully deleted one document.");

            res.send(true);

         }

      })



      app.post('/comments', async (req, res) => {
         const comments = req.body;
         const result = await commentsCollection.insertOne(comments);
         res.send(result);
      })


      app.get('/comments', async (req, res) => {
         const postId = req.query.postId;

         const query = {postId: postId }

         const cursor = await commentsCollection.find(query);
         const result = await cursor.toArray();

         res.send(result);
      })





   }
   finally {

   }


}


run().catch(err => console.error(err));


app.get('/', async (req, res) => {
   res.send("our server ok running");
})

app.listen(port, () => console.log(`trendify running ${port}`))
