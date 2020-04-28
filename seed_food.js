/* this is pre-re-design of food diary into diary->diary days->diary items */

"use strict";

const mongoose = require("mongoose"),
FoodDiaryItem = require("./models/food_diary_item"),
FoodDiary = require("./models/food_diary_day");

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
FoodDiary.deleteMany() //check assumption that child foot items are also deleted!!!!
  .exec()
  .then(() => {
    console.log("FoodDiary data is empty!");
  });
*/
  const foods = {
      foodDiaryItems:[
            {foodName: "Sausage", foodQuantity: "2", foodUnits: "Pieces"},
            {foodName: "Mince", foodQuantity: ".3", foodUnits: "Kg" },
            { foodName: "Sweets", foodQuantity: "4", foodUnits: "Pieces"},
            { foodName: "Dog Biscuits", foodQuantity: "4", foodUnits: "Pieces"}
      ],
      
  };

//const diary = new FoodDiary(foods);
//const doc = diary.save();
//console.log(doc)
var tmp_diary;

/*
FoodDiary.deleteMany()
  .exec()
  .then(() => {
    console.log("FoodDiary is now empty!");
  })
  .then(function(){
    FoodDiaryItem.deleteMany()
    .exec()
    .then(() => {
      console.log("FoodDiaryItems is now empty!");
    });
  })
.then(()=>{
  
    return FoodDiary.create({foodDiaryDate:'2020-04-17'});
})
*/
FoodDiary.create({foodDiaryDate:'2020-04-16'})
.then(food_diary => {
    tmp_diary = food_diary; //Grab ref to FoodDiary in global tmp variable so can use in next then block.  
    return FoodDiaryItem.create(
        {foodName: "Dog Food", foodQuantity: "2", foodUnits: "Pieces"}
        );
    })
.then(diary_item=>{
    tmp_diary.foodDiaryItems.push(diary_item);
    tmp_diary.save();
})
.then(()=> {
  return FoodDiaryItem.create(
      {foodName: "Ice Cream", foodQuantity: ".5", foodUnits: "Kg"}
      );
  })
.then(diary_item=>{
  tmp_diary.foodDiaryItems.push(diary_item);
  tmp_diary.save();
})
.then(()=>{
   // mongoose.connection.close();
   console.log("end");
});

//mongoose.connection.close();

//const diaryEntry1 = new FoodDiary({foodDiaryDate:'2020-04-19'});

