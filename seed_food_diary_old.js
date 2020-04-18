"use strict";

const mongoose = require("mongoose"),
FoodDiaryItem = require("./models/food_diary_item"),
FoodDiary = require("./models/food_diary");

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
//    foodEntryDate: "2020-02-23T16:26:43.511Z" 
var seed_food_diary_items = [
  {
    foodName: "Bread",
    foodQuantity: "2",
    foodUnits: "Slices",
  },
  {
    foodName: "Meat",
    foodQuantity: ".3",
    foodUnits: "Kg",
    foodEntryDate: 10
  },
  {
    foodName: "Sweets",
    foodQuantity: "4",
    foodUnits: "Pieces"
  },
  {
    foodName: "Dog Biscuits",
    foodQuantity: "2",
    foodUnits: "Pieces"
  }
];
*/

FoodDiary.deleteMany() //check assumption that child foot items are also deleted!!!!
  .exec()
  .then(() => {
    console.log("FoodDiary data is empty!");
  })
  .then(()=>{
    FoodDiaryItem.deleteMany() //check assumption that child foot items are also deleted!!!!
      .exec()
      .then(() => {
        console.log("FoodDiaryItems data is empty!");
  });
})
.catch(error => {
  console.log(`ERROR: ${error}`);
});


/*
var food_diary_items = [];

console.log("About to populate food items..");
//populate empty array of food_diary_items
seed_food_diary_items.forEach(f => {
  food_diary_items.push( 
    //creates a MongoDB document for each element  
    FoodDiaryItem.create({
      foodName: f.foodName,
      foodQuantity: f.foodQuantity,
      foodUnits: f.foodUnits
    })
  );
});
*/
FoodDiaryItem.create(
  [ 	
    { foodName: "Rashers", "foodQuantity": "2", "foodUnits": "Pieces"},
    { foodName: "Mince", "foodQuantity": ".3", "foodUnits": "Kg" },
    { foodName: "Sweets", "foodQuantity": "4", "foodUnits": "Pieces"},
    { foodName: "Dog Biscuits", "foodQuantity": "4", "foodUnits": "Pieces"}
  ]
)
.then((item)=>{
  item.save();
})
.catch(error => {
  console.log(`ERROR: ${error}`);
});
/*
.then((diary_items)=>{
  
  var diary = FoodDiary.create({foodDiaryDate:"2020-04-18"});

  diary.foodDiaryItems.(diary_items);
  diary.save();

}) 
//FoodDiary.create({foodDiaryDate:"2020-04-18"})
.then((r)=>
      {

        console.log(JSON.stringify(r));
      }) //then
.catch(error => {
      console.log(`ERROR: ${error}`);
});
  */
 





