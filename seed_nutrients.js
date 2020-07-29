"use strict";

const mongoose = require("mongoose"),
FoodNutrients = require("./models/food_nutrients");

//Connect to fitpaw_db database
mongoose.connect(
  "mongodb://localhost:27017/fitpaw_db",
{ 
  useNewUrlParser: true,  
  useUnifiedTopology: true
}
);

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});


let foodNutrients = {  
  foodName: "bakers wild foul",
  foodReferenceQuantity: 1,
  foodServingUnit: "scoop",
  foodServingWeightGrams: 25,
  calories: 140,
  fat: 25,
  protein: 12,
  carbohydrates: 80,
  fibre: 1,
  fat_saturated: 24,
  sugar: 60,
  sodium: 40,
  foodType:"Branded"
}

FoodNutrients.create(foodNutrients)
.then(foodNutrients=>{
  mongoose.connection.close();
})
.catch(error => {
    console.log(`IW Error: ${error.message}`);
    mongoose.connection.close();
  });