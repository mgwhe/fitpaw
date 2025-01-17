"use strict";

//think this file is redundant because breed is added based on enum list. 

const mongoose = require("mongoose"),
//reference models so can create objects from them and store in MongoDB using Mongoose API
Breed = require("./models/breed");

//Connect to fitpaw_db database
mongoose.connect(
  "mongodb://localhost:27017/fitpaw_db",
{ 
  useNewUrlParser: true, //required 
  useUnifiedTopology: true
}
);

const db = mongoose.connection;

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
  });

  
var breeds = [
  {
    breedName: "Field Spaniel",
    breedDescription: "Nice little dog"
  },
  {
    breedName: "Dalmatian",
    breedDescription: "Nice dog"
  },
];


Breed.deleteMany()
  .exec()
  .then(() => {
    console.log("Breed data is empty!");
  });
  

var commands = [];

breeds.forEach(b => {
  commands.push(
    Breed.create({
      breedName: b.breedName,
      breedDescription: b.breedDescription
    })
  );
});


Promise.all(commands)
  .then(r => {
    console.log(JSON.stringify(r));
    mongoose.connection.close();
  })
  .catch(error => {
    console.log(`ERROR: ${error}`);
  });

//mongoose.connection.close();