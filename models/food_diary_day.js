"use strict";

//get reference to mongoose module and store in varaiable mongoose 
const mongoose = require("mongoose"),
validator = require ("validator"), //validate e-mails, etc. 
FoodNutrients=require("./food_nutrients"),
User = require("./user");

const FoodItemSchema = new mongoose.Schema({ 
  foodName: {
  type: String,
  required: true,
  trim: true //always call string trim before storing
},
foodQuantity: { 
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
calories:{
  type: Number,
  default: -1
},
foodNutrients: { type: mongoose.Schema.Types.ObjectId, ref: "FoodNutrients"},
},
{ //timestamp each record when created & updated
timestamps: true
});

//to do add a pre-save hook for the email so linked to the user profile 22.2
const FoodDiaryDaySchema = new mongoose.Schema({ 
    foodDiaryItems: [ 
     //type: mongoose.Schema.Types.ObjectId, ref: "FoodItem"
     FoodItemSchema
      ],
    foodDiaryDayDate: {
        type: Date,
        required: true
    },
    userRef: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
},
{ //timestamp each record when created & updated
  timestamps: true
});

module.exports = mongoose.model("FoodDiaryDay", FoodDiaryDaySchema);

