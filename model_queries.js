"use strict";
const databaseName = "fitpaw_db";
const connectionURL = "mongodb://localhost:27017/";

const mongoose = require("mongoose"),

//reference models so can create objects 
PetProfile = require("./models/pet_profile"),
Breed = require("./models/breed");

//Connect to fitpaw_db database
mongoose.connect(connectionURL + databaseName,
{ 
  useNewUrlParser: true, //required 
  useUnifiedTopology: true
}
);

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

//Sample create a petProfile + Closes database connection
/*
const pp = new PetProfile({
    petName: "Shaggy",
    petAge: 3,
    petWeight:7,
    petTag: "XYZ890"
})

pp.save().then(()=>{
    console.log(pp);
    mongoose.connection.close();
}).catch((error)=>{
    console.log(error);
})
*/

