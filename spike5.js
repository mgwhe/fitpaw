/* Create a food diary, add a food day, add a food item */

"use strict";

const mongoose = require("mongoose"),
FoodItem = require("./models/food_diary_item"),
FoodDiaryDay = require("./models/food_diary_day");

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
    
FoodDiaryDay.create({userRef:'5eab0466ea6dbbd428bdf563',foodDiaryDayDate:'2020-04-20'})
.then(diaryDay=>{
      //Grab ref to FoodDiary in global tmp variable so can use in next then block.  
      FoodDiaryDay.findByIdAndUpdate(diaryDay._id,    
        {
            $push: {
                    foodDiaryItems: {foodName: 'Sausage', foodQuantity: '2', foodUnits: 'Pieces'}                    
            }
         },
        {new: true, useFindAndModify: false }
    );
})  
.catch(error => {
        console.log(`IW Error: ${error.message}`);
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
  },
  userRef: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
}

*/