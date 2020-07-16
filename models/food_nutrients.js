"use strict";

//get reference to mongoose module and store in varaiable mongoose 
const mongoose = require("mongoose"),

FoodNutrientsSchema = new mongoose.Schema({ 
    foodName: {
    type: String,
    required: true,
    trim: true //always call string trim before storing
  },
  calories: { 
    type: Number,
    required: true,
    default:-1
  },
  fat: { 
    type: Number,
    required: true,
    default:-1
  },
  protein: { 
    type: Number,
    required: true,
    default:-1
  },
  carbohydrates: { 
    type: Number,
    required: true,
    default:-1
  },
  fibre: { 
    type: Number,
    required: true,
    default:-1
  },
  fat_saturated: { 
    type: Number,
    required: true
  },
  fat_trans: { 
    type: Number,
    required: true,
    default:-1
  },
  fat_monounsaturated: { 
    type: Number,
    required: true,
    default:-1
  },
  fat_polyunsaturated: { 
    type: Number,
    required: true,
    default:-1
  },
  sugar: { 
    type: Number,
    required: true,
    default:-1
  }
},
  { //timestamp each record when created & updated
    timestamps: true
  });
  
  module.exports = mongoose.model("FoodNutrients", FoodNutrientsSchema);