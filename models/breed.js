"use strict";

const mongoose = require("mongoose");

const breed = new mongoose.Schema({ //create instance of schema
  breedName: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("Breed", breed); //export model 
