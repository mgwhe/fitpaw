"use strict";

//get reference to mongoose module and store in varaiable mongoose 
const mongoose = require("mongoose");

//Define a schema which allows rules to be placed on the fields like size, type, requried, etc. 
const pet = new mongoose.Schema({
  petName: {
    type: String,
    required: true
  },
  petAge: {
    type: Number,
    min: [0, "Please use a positive number of years"],
    max: [40, "Please contact the Guinness Book of Records"],
    required: true
  },
  petBreed: 
    [{ type: mongoose.Schema.Types.ObjectId, ref: "Breed" }]
  ,
  petWeight:{
    type: Number,
    min: [1, "Weight must be more than 1Kg"],
    max: [50, "Please refer your pet to A&E"],
    required: true
  } 
});

//Add a function getPetProfileInfo to dump out pet values  
pet.methods.getPetProfileInfo = function() {
  return `Pet Name: ${this.petName} Pet Age: ${this.petAge} Pet Breed: ${this.petBreed} Pet Breed: ${this.petWeight}`;
};

//Take the MongoDB schema called pet defined above, 
//make a Mongoose model (class) from the schema called PetProfile  
//export the model so it can use it in other files by the name PetProfile. (We no longer use local pet variable)
module.exports = mongoose.model("PetProfile", pet);
//once above is done we can now create pet objects from PetProfile in other files
