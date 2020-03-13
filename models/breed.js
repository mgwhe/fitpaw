"use strict";

const mongoose = require("mongoose");

//define a schema called breed with following fields and rules
const breed = new mongoose.Schema({ 
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
module.exports = mongoose.model("Breed", breed); //export model 
