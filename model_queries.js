"use strict";
const databaseName = "fitpaw_db";
const connectionURL = "mongodb://localhost:27017/";

const mongoose = require("mongoose"),

//reference models so can create objects 
Memberprofile = require("./models/member_profile"),
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

const mp = new MemberProfile({
    memberNumber: 1,
    email: "joe@gmail.com",
    memberName:"Joe",
    startDate: "",
})

mp.save().then(()=>{
    console.log(mp);
    mongoose.connection.close();
}).catch((error)=>{
    console.log(error);
})

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

