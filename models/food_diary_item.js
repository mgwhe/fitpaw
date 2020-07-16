"use strict";

//get reference to mongoose module and store in varaiable mongoose 
const mongoose = require("mongoose"),
validator = require ("validator"), //validate e-mails, etc. 

FoodItemSchema = new mongoose.Schema({ 
    foodName: {
    type: String,
    required: true,
    trim: true //always call string trim before storing
  },
  foodQuantity: { //make an enum
    type: String,
    required: true,
    trim: true 
  },
  foodUnits: {
    type: String,
    required: true,
    trim: true 
  },
  mealNumber:{
    type: Number,
    default: 0
  },
  foodType: {
    type: String,
    required: true,
    default: 'Common',
    enum: [
    'Common',
    'Branded'
  ]
  },
  foodNutrients: { 
    type: mongoose.Schema.Types.ObjectId, ref: "FoodNutrients"
  },
},
{ //timestamp each record when created & updated
  timestamps: true
});

module.exports = mongoose.model("FoodItem", FoodItemSchema);
