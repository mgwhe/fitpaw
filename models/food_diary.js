"use strict";

//get reference to mongoose module and store in varaiable mongoose 
const mongoose = require("mongoose"),
validator = require ("validator"), //validate e-mails, etc. 
FoodDiaryItem = require("./food_diary_day");

//to do add a pre-save hook for the email so linked to the user profile 22.2
const FoodDiarySchema = new mongoose.Schema({ 
    foodDiaryDays: [{ 
     type: mongoose.Schema.Types.ObjectId, ref: "FoodDiaryDay"
      }],
      diaryType: {type: String}
},
{ //timestamp each record when created & updated
  timestamps: true
});

module.exports = mongoose.model("FoodDiary", FoodDiarySchema);
