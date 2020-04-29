/* this is pre-re-design of food diary into diary->diary days->diary items */

"use strict";

const mongoose = require("mongoose"),
FoodItem = require("./models/food_diary_item"),
FoodDiaryDay = require("./models/food_diary_day");

  /*
  mongoose.connect(
    "mongodb://dogpaw-db:Pz1aO7zh5i2zVcZ9O8VRxMjKffbcXt8cXbUzNUNYI5f3ySGNgS97BxQ0m4nOaqgNmc5HN1Fd10Z69K3pN8grDg==@dogpaw-db.documents.azure.com:10255/?ssl=true&replicaSet=globaldb",
  { useNewUrlParser: true, 
    useUnifiedTopology: true
  }
);
*/
//Connect to fitpaw_db database
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

/*
  const foods = { //do you need foods?
      foodItems:[
            {foodName: "Sausage", foodQuantity: "2", foodUnits: "Pieces"},
            {foodName: "Mince", foodQuantity: ".3", foodUnits: "Kg" },
            { foodName: "Sweets", foodQuantity: "4", foodUnits: "Pieces"},
            { foodName: "Dog Biscuits", foodQuantity: "4", foodUnits: "Pieces"}
      ],
  };
*/

  var tmp_diary_day;
  var tmp_diary_days;
 // FoodDiaryDay.create([{foodDiaryDayDate:'2020-04-29'},{foodDiaryDayDate:'2020-04-28'}]);
  FoodDiaryDay.insertMany([{foodDiaryDayDate:'2020-04-27'},{foodDiaryDayDate:'2020-04-26'}])
  .then(diaryDocs=>{
    tmp_diary_days = diaryDocs;
  })
  FoodDiaryDay.create({foodDiaryDayDate:'2020-04-16'})
  .then(food_diary_day => {
      tmp_diary_day = food_diary_day; //Grab ref to FoodDiary in global tmp variable so can use in next then block.  
      return FoodItem.insertMany([
        {foodName: 'Sausage', foodQuantity: '2', foodUnits: 'Pieces'},
        {foodName: 'Mince', foodQuantity: '3', foodUnits: 'Kg' },
        { foodName: 'Sweets', foodQuantity: '4', foodUnits: 'Pieces'},
        { foodName: 'Dog Biscuits', foodQuantity: '4', foodUnits: 'Pieces'},
        {foodName: 'Dog Food', foodQuantity: '2', foodUnits: 'Pieces'}
      ]);
    })
  .then(docFoodItems =>{
    //tmp_diary_day.foodDiaryItems.push(diary_item);
     // tmp_diary_day.save();
     FoodDiaryDay.inspect(FoodDiaryDay);
     console.log();

     tmp_diary_days.forEach(docDay => {
        docFoodItems.forEach(docItem => {
              docDay.foodDiaryItems.push(docItem);     
          });
      });
  })
  
  /*
  .then(()=> { //add another
    return FoodItem.create(
        {foodName: 'Ice Cream', foodQuantity: '.5', foodUnits: 'Kg'}
        );
    })
  .then(diary_item=>{
    tmp_diary_day.foodDiaryItems.push(diary_item);
    tmp_diary_day.save();
  }) */
  .then(()=>{
    console.log("end");
  })
  .catch(error => {
    console.log(`IW Error: ${error.message}`);
    mongoose.connection.close();
  });
  

