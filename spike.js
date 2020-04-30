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

var tmp_diary_day;

FoodDiaryDay.findOne({foodDiaryDayDate:'2020-04-16'})
.then(diaryDay=>{
 
    if(diaryDay!==undefined)
    {
        FoodDiaryDay.inspect(FoodDiaryDay);
        console.log(FoodDiaryDay);
        console.log(JSON.stringify(diaryDay));
        console.log("id is: $(diaryDay._id)");
        console.log(JSON.stringify(diaryDay._id));

        tmp_diary_day = diaryDay; //grab ref for later
    }

   // diaryDay.select(foodDiaryDayDate); //select fields
   return FoodItem.create(
    {foodName: 'Bananas', foodQuantity: '20', foodUnits: 'Pieces'}
  );
})
.then((foodItem)=>{
  console.log(JSON.stringify(foodItem));
  tmp_diary_day.foodDiaryItems.push(foodItem);
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
  }
}*/