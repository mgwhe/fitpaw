"use strict";

const mongoose = require("mongoose");

//define a schema called breed with following fields and rules
//mongoose enforces the rules of the schema (MongoDB does not)
const breedSchema = new mongoose.Schema({ 
  breedName: {
    type: String,
    required: true,
    unique: true
  },
  breedDescription: {
    type: String,
    required: false
  },
});

//make a model from the breed schema called Breed and export it so it can be used elsewhere 
//once model is created objects can be instantiated and use to read/write to MongoDB
//this statment does two steps in one - creates the model, exports the created model so it can be used later. 
module.exports = mongoose.model("Breed", breedSchema); //export model 
