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

var tmp_diary_day,tmp_diary_days;

//simulate existing Diary
const diary = new FoodDiary({diaryType:"dog"});

if(diary!==undefined){
    FoodDiary.inspect(FoodDiary);
    console.log(FoodDiary);
    
    FoodDiaryDay.create()
    .then(day=>{
        diary.foodDiaryDays.push(day._id);
        diary.save();
    }) 
    .catch(error => {
        console.log(`IW Error 1: ${error.message}`);
        mongoose.connection.close();
    });
}
else{
    console.log("Never created or saved");
}

FoodDiary.insertMany([{foodDiaryDayDate:'2020-04-27'},{foodDiaryDayDate:'2020-04-26'}])
// diary.foodDiaryDays.push([{foodDiaryDayDate:'2020-04-27'},{foodDiaryDayDate:'2020-04-26'}])
.then(diaryDocs=>{
// tmp_diary_days = diaryDocs; 
    //find diary day and add food item
    FoodDiaryDay.findOne({foodDiaryDayDate:'2020-04-26'})
        .then(diaryDay=>{
            if(diaryDay!==undefined){
              //  FoodDiaryDay.inspect(FoodDiaryDay);
              //  console.log(FoodDiaryDay);
                console.log(JSON.stringify(diaryDay));
            //    console.log("id is: $(diaryDay._id)");
              //  console.log(JSON.stringify(diaryDay));
                console.log("-------------------------------------------");

                tmp_diary_day = diaryDay; //grab ref for later

                diaryDay.foodDiaryItems.push(new FoodItem({foodName: 'Pears', foodQuantity: '20', foodUnits: 'Pieces'}));
          //    tmp_diary_day.foodDiaryItems.push(new FoodItem({foodName: 'Pears', foodQuantity: '20', foodUnits: 'Pieces'}));
          
          tmp_diary_day.save();

                console.log(JSON.stringify(tmp_diary_day));

                console.log("-------------------------------------------");

                console.log(JSON.stringify(tmp_diary_day.foodDiaryItems[0]));
            }
        }) //then
        .catch(error => {
            console.log(`IW Error 2: ${error.message}`);
            mongoose.connection.close();
        });
}) //then
.catch(error => {
        console.log(`IW Error 3: ${error.message}`);
        mongoose.connection.close();
});




/*
const FoodDiaryDaySchema = new mongoose.Schema({ 
  foodDiaryItems: [{ 
   type: mongoose.Schema.Types.ObjectId, ref: "FoodItem"
    }],
  foodDiaryDayDate: {
      type: Date,
      required: true
  }
}

const FoodDiarySchema = new mongoose.Schema({ 
    foodDiaryDays: [{ 
     type: mongoose.Schema.Types.ObjectId, ref: "FoodDiaryDay"
      }],
      diaryType: {type: String}
},
*/