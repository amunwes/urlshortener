require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// const dns = require('dns');
// const url = require('url');
const isURL = require('is-url');

const mongoose = require('mongoose');
const models = require("./models.js");


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// Basic Configuration
const port = process.env.PORT || 3000;

// let URL = new mongoose.model('URL', urlSchema);
// let counter = new mongoose.model('counter', counterSchema);
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// app.use(function(req, res, next) {
//   var log = req.method + " " + req.path + " - " + req.ip;
//   console.log(log);
//   next();
// })

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.post('/api/shorturl', function(req, res){
  //TODO: need to figure out how to add these short urls to routing and redirect to /api/shorturl when post is sent
  
  console.log(`provided url: ${req.body.url}` );
  console.log(isURL(req.body.url));
  if (isURL(req.body.url)){
    models.checkDBforURL(req.body.url, function(err, data) {
      if (err) console.log(err);
      if (data === null){
        models.getNextSequence("userid", function(err, data){
          if (err) console.log(err);
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

  })}
  else {
    res.json({"error":"Invalid URL"});
  }

});

app.get("/api/shorturl/:short_url", (req, res) => {
  const { short_url } = req.params;
  console.log(short_url);
  models.getURLfromDB(short_url, function(err, data){
    if (err) console.log(err);
    if (data)
      res.redirect(data.longURL);
    else {
      res.json({"error":"No short URL found for the given input"})
    }
  });
  
});


// Your first API endpoint


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
