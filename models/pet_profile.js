"use strict";

const mongoose = require("mongoose");
//replace subscriber with pet
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

pet.methods.getPetProfileInfo = function() {
  return `Pet Name: ${this.petName} Pet Age: ${this.petAge} Pet Breed: ${this.petBreed} Pet Breed: ${this.petWeight}`;
};

module.exports = mongoose.model("PetProfile", pet);
