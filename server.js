const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const config = require('./config/config');
const cors = require('cors');
const app = express();


// BodyPraser Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());


// DB Config 
mongoose.Promise = global.Promise;

//Connect to Mongo
mongoose
  .connect(config.db, { useNewUrlParser: true})
  .then(() => console.log('MongoDB Connected ...'))
  .catch(err => console.log(err));

 
// Use routes   
app.use('/api/users', require('./routes/api/users'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/public/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log());



