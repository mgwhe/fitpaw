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
    
var tmp_diary_day;

FoodDiaryDay.create({userRef:'5eabd95a216c0a38bce63884',foodDiaryDayDate:'2020-04-30'})
.then(diaryDay=>{

    tmp_diary_day = diaryDay;

    return FoodItem.insertMany([
        {foodName: 'Tayto', foodQuantity: '1', foodUnits: 'Packet'},
        {foodName: 'Egg', foodQuantity: '3', foodUnits: 'Pieces' },
        {foodName: 'Sweets', foodQuantity: '4', foodUnits: 'Pieces'},
        {foodName: 'Dog Biscuits', foodQuantity: '4', foodUnits: 'Pieces'},
        {foodName: 'Dog Food', foodQuantity: '2', foodUnits: 'Pieces'}
      ]);
})
.then(docFoodItems=>{
            docFoodItems.forEach(docFoodItem => {
              //  console.log(docFoodItem._id);
                tmp_diary_day.foodDiaryItems.push(docFoodItem._id);     
              }); 
              tmp_diary_day.save();

              console.log("From FoodDiaryDay"); 
              console.log(tmp_diary_day);        
})
.then(()=>{
          //check
            FoodDiaryDay.findOne({userRef:'5eabd95a216c0a38bce63884'}).populate('foodDiaryItems')
            .then(f=>{
                console.log("------1-----------------");
                console.log(f);
            })
            .catch(error => {
                console.log(`IW Error 1: ${error.message}`);
                mongoose.connection.close();
            })
})
.catch(error => {
        console.log(`IW Error 2: ${error.message}`);
        mongoose.connection.close();
});

      //Grab ref to FoodDiary in global tmp variable so can use in next then block.  
  /*    FoodDiaryDay.findByIdAndUpdate(diaryDay,    
        {
            $push: {
                    foodDiaryItems: {foodName: 'Sausage', foodQuantity: '2', foodUnits: 'Pieces'}                    
            }
         },
        {new: true, useFindAndModify: false }
    );
    */
   
 //   diaryDay.push({foodDiaryItems: {foodName: 'Sausage', foodQuantity: '2', foodUnits: 'Pieces'});




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