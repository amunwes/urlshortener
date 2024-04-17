let mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortURL: {
        type: Number,
        Required: true
    },
    longURL: {
        type: String,
        Required: true,
        unique: true
    } 
});

const counterSchema = new mongoose.Schema({
    _id: String,
    seq: Number
});

let URL = new mongoose.model('URL', urlSchema);
let Counter = new mongoose.model('counter', counterSchema);

//returns null if doesnt exist or database object if it does.
const checkDBforURL = (url, done) => {
    URL.findOne({longURL: url}, function(err, data) {
      if (err) console.log(err);
      done(null, data);
    });
  };

const createCounter = (done) => {
    var count = new Counter({
        _id: "userid",
        seq: 0  
    });
    count.save(function(err, data) {
        if (err) return done(err);
        done(null, data);
    });
}

const getNextSequence = (id, done) => {
    Counter.findOneAndUpdate(
        {_id: id}, {$inc: { seq: 1 }}, {new: true}, function(err, count){
        if (err) console.log(err);
        done(null, count);
    });
}

const insertURL = (longURL, shortURL, done) => {
    let url = new URL({
        shortURL: shortURL,
        longURL: longURL
    });
    url.save(function(err, data) {
        if (err) console.log(err);
        done(null, data);
    });
}


exports.URL = URL;
exports.Counter = Counter;

exports.checkDBforURL = checkDBforURL;
exports.createCounter = createCounter;
exports.getNextSequence = getNextSequence;
exports.insertURL = insertURL;