//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//for connecting to our database
mongoose.connect("mongodb+srv://admin-aditya:Test123@cluster0.9265w.mongodb.net/goGagaDB");

//for creating a new schema
const entrySchema = new mongoose.Schema({
    name: String,
    location: String
  });

//Now we will create a model for this schema
const Entry = mongoose.model("Entry", entrySchema);

app.get("/", function(req, res){

  Entry.find({}, function(err, entries){
    res.render("home", {
      entries: entries
      });
  });
});

app.get("/add", function(req, res){
  res.render("add");
});

app.post("/add", function(req, res){
  const entry = new Entry({
    name: req.body.entryName,
    location: req.body.entryLocation
  });


  entry.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.post("/search", function(req, res){
  const query = req.body.searchInput
  Entry.find({$or: [
    {name: query},
    {location: query}
]}, function(err, queryResult){
    console.log(queryResult)
    if(!err) {
      res.render("search", {
        queryRes: queryResult
      });
    }
  });
  
});

let port = process.env.PORT;
if(port === null || port === ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});