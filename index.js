require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const models = require("./models.js");

const URL = models.URL;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// Basic Configuration
const port = process.env.PORT || 3000;

// let URL = new mongoose.model('URL', urlSchema);
// let counter = new mongoose.model('counter', counterSchema);
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function(req, res){
  //TODO: check valid URL at start of sequence, need to figure out how to add these short urls to routing
  
  
  console.log(`provided url: ${req.body.url}` );
  models.checkDBforURL(req.body.url, function(err, data) {
    if (err) console.log(err);
    
    console.log(`object from db: ${data}`);

    if (data === null){
      models.getNextSequence("userid", function(err, data){
        if (err) console.log(err);
        
        console.log(`next number in sequence: ${data.seq}`);
        res.json({
          original_url : req.body.url, 
          short_url : data.seq
        });
        models.insertURL(req.body.url, data.seq, function(err, data){
          if (err) console.log(err);
        });
      });
    }
    else{
      res.json({
        original_url : req.body.url, 
        short_url : data.shortURL
      });
    }

  })
  
});
  

  

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
