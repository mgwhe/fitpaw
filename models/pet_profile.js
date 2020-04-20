"use strict";

//get reference to mongoose module and store in varaiable mongoose 
const mongoose = require("mongoose"),
Breed = require("./breed"),
FoodDiary = require("./food_diary");

//A Mongoose schema is a configuration object for a Mongoose model (docs)
//Define a schema which allows rules to be placed on the fields like size, type, requried, etc. 
const PetProfileSchema = new mongoose.Schema({
  petOwnerEmail:{
    type: String,
    index: true,
    required: true,
    lowercase: true,
    trim:true,
    validate(value){
      if(!validator.isEmail(value))
      {
          throw new Error("Invalid email!");
      }
    },  
    unique: true 
  },
  petName: {
    type: String,
    required: true
  },
  petAge: {
    type: Number,
    min: [0, "Please use a positive number of years"],
    max: [40, "Please verify your pet's age!"],
    required: true
  },
  petBreed: { 
    type: mongoose.Schema.Types.ObjectId, ref: "Breed",
  },
  petTagNumber: {
    type: String,
    required: false
  },
  foodDiary:{
    type: mongoose.Schema.Types.ObjectId, ref: "FoodDiary"
  },
  petWeight:{
    type: Number,
    min: [1, "Weight must be more than 1Kg"],
    max: [50, "Please refer your pet to A&E"],
    required: true
  } 
},
{ //timestamp each record when created, when updated
  timestamps: true
}
);

//Add a function getPetProfileInfo to dump out pet values  
PetProfileSchema.methods.getPetProfileInfo = function() {
  return `Pet Name: ${this.petName} Pet Age: ${this.petAge} Pet Weight: ${this.petWeight}`;
};

//Take the MongoDB schema called petSchema defined above, 
//make a Mongoose model (class) from the schema called PetProfile  
//export the model so it can use it in other files by the name PetProfile. (No longer use local pet variable)
module.exports = mongoose.model("PetProfile", PetProfileSchema);
//once above is done I can now create pet objects from PetProfile in other files or access existing ones
