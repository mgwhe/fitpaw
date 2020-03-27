"use strict";

const mongoose = require("mongoose");

//define a schema called breed with following fields and rules
//mongoose enforces the rules of the schema (MongoDB does not)
//A Mongoose schema is a configuration object for a Mongoose model (docs)
//**Use uppercase 1st letter for Schemas** (not according to docs)
const BreedSchema = new mongoose.Schema({ 
  breedName: {
    type: String,
    required: true,
    enum: [
    'Cairn Terrier',
    'Dachshund', 
    'Dalmatian',
    'English Cocker Spaniel',
    'English Foxhound',
    'English Setter', 
    'Field Spaniel',
    'Finnish Lapphund',
    'German Shepherd Dog',
    'Hanoverian Scenthound']
  },
  breedDescription: {
    type: String,
    required: false
  },
},
{ //timestamp each record when created, when updated
  timestamps: true
});

//Add a static method to the schema to find the Breed object based on breed name 

BreedSchema.static('findByBreed', function(breedName) {
  return this.find({ breedName });
});

//make a model from the breed schema called Breed and export it so it can be used elsewhere 
//once model is created objects can be instantiated and use to read/write to MongoDB
//this statment does two steps in one - creates (compiles) the model, then exports the created model so it can be used later. 
module.exports = mongoose.model("Breed", BreedSchema); //Create, then export model 
//From Mongoose docs - in the above Breed model **AUTOMATICALLY** maps to 'breeds' document collection in MongoDB 
