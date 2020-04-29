"use strict";

//get reference to mongoose module and store in varaiable mongoose 
const mongoose = require("mongoose"),
validator = require ("validator"), //validate e-mails, etc. 
FoodItem = require("./food_diary_item");

//to do add a pre-save hook for the email so linked to the user profile 22.2
const FoodDiaryDaySchema = new mongoose.Schema({ 
    foodDiaryItems: [{ 
     type: mongoose.Schema.Types.ObjectId, ref: "FoodItem"
      }],
    foodDiaryDayDate: {
        type: Date,
        required: true
    }
},
{ //timestamp each record when created & updated
  timestamps: true
});

module.exports = mongoose.model("FoodDiaryDay", FoodDiaryDaySchema);
