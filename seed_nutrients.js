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
  foodName: "bakers puppy pieces",
  foodReferenceQuantity: 2,
  foodServingUnit: "pieces",
  foodServingWeightGrams: 30,
  calories: 100,
  fat: 10,
  protein: 18,
  carbohydrates: 40,
  fibre: 1,
  fat_saturated: 8,
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