"use strict";

const mongoose = require("mongoose"),
//reference models so can create objects from them and store in MongoDB using Mongoose API
Breed = require("./models/breed");

//Connect to fitpaw_db database
mongoose.connect(
  "mongodb://fitpaw_db:localhost:27017",
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
    breedName: "Terrier",
    breedDescription: "Nice little dog"
  },
  {
    breedName: "Irish Wolfhound",
    breedDescription: "Nice big dog"
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

  