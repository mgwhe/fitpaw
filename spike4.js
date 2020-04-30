/* Create a food diary, add a food day, add a food item */

"use strict";

const mongoose = require("mongoose"),
FoodItem = require("./models/food_diary_item"),
FoodDiaryDay = require("./models/food_diary_day"),
FoodDiary = require("./models/food_diary");

mongoose.connect(
  "mongodb://localhost:27017/fitpaw_db",
{ 
  useNewUrlParser: true, //required 
  useUnifiedTopology: true
}
);

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

//Create a diary and add a diary day
const diary = new FoodDiary({diaryType:"dog"});

if(diary!==undefined){
    FoodDiary.inspect(FoodDiary);
    console.log(FoodDiary);
    
    FoodDiaryDay.create()
    .then(day=>{
        diary.foodDiaryDays.push(day);
        diary.save();
    }) 
}
else{
    console.log("Never created or saved");
}





