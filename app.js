const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();


mongoose.connect('mongodb://mean123:mean123@cluster0-shard-00-00.lrc9z.mongodb.net:27017,cluster0-shard-00-01.lrc9z.mongodb.net:27017,cluster0-shard-00-02.lrc9z.mongodb.net:27017/odongmongodb?ssl=true&replicaSet=atlas-wmahz9-shard-0&authSource=admin&retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Successfully connect to MongoDB."))
  .catch(err => console.error("Connection error", err))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const authorRouter = require('./Views/author');
const postRouter = require('./Views/post');

app.use('/api', authorRouter);
app.use('/api', postRouter);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`);
});
