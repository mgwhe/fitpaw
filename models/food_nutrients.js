"use strict";

//get reference to mongoose module and store in varaiable mongoose 
const mongoose = require("mongoose"),

FoodNutrientsSchema = new mongoose.Schema({   
  foodName: {
    type: String,
    required: true,
    trim: true //always call string trim before storing
  },
  foodServingUnit: {
    type: String,
    trim: true //always call string trim before storing
  },
  ndb_no: { //national db ref - may be useful
    type: Number,
    default:-1
  },
  foodServingWeightGrams: { 
    type: Number,
    default:-1
  },
  foodReferenceQuantity: {
    type: Number,
    default:-1
  },
  calories: { 
    type: Number,
    default:-1
  },
  fat: { 
    type: Number,
    default:-1
  },
  protein: { 
    type: Number,
    default:-1
  },
  carbohydrates: { 
    type: Number,
    default:-1
  },
  fibre: { 
    type: Number,
    default:-1
  },
  fat_saturated: { 
    type: Number,
    default:-1
  },
  sugar: { 
    type: Number,
    default:-1
  },
  sodium: { 
    type: Number,
    default:-1
  }
},
  { //timestamp each record when created & updated
    timestamps: true
  });
  
  module.exports = mongoose.model("FoodNutrients", FoodNutrientsSchema);