"use strict";

//get reference to mongoose module and store in varaiable mongoose 
const mongoose = require("mongoose"),
validator = require ("validator"), //validate e-mails, etc. 
FoodNutrients=require("./food_nutrients"),
helpers = require("../controllers/helpers"),

FoodItemSchema = new mongoose.Schema({ 
    foodName: {
    type: String,
    required: true,
    trim: true //always call string trim before storing
  },
  foodQuantity: { //make an enum
    type: String,
    required: true,
    trim: true 
  },
  foodUnits: {
    type: String,
    required: true,
    trim: true 
  },
  mealNumber:{
    type: Number,
    default: 0
  },
  foodType: {
    type: String,
    required: true,
    default: 'Common',
    enum: [
    'Common',
    'Branded'
  ]
  },
  foodNutrients: { 
    type: mongoose.Schema.Types.ObjectId, ref: "FoodNutrients"
  },
},
{ //timestamp each record when created & updated
  timestamps: true
});


FoodItemSchema.pre('save',function(next){

  console.log("in pre-save of fooditem");

  let foodItem = this;
/*
         FoodNutrients.findOne( {"foodName": foodItem.foodName})
        .then(nutrientqueryResult=>{
            if(nutrientqueryResult===null){ //food nutrients not known to FitPaw database 
                console.log("No such food in FitPaw DB");
                //Get nutrients from Nutritionix via API
                helpers.getNutrients(foodItem.foodName) //Issue resolved - needed to do .then as API call is async and using let will return too early!!
                .then(nutrientAPIResults=>{
                    FoodNutrients.create(helpers.assignNutrientAPIResultsToFoodNutrients(nutrientAPIResults))
                    .then((foodNutrientDocument)=>{
                        foodItem.foodNutrients =foodNutrientDocument._id;
                        console.log("attaching id to new FoodItem: "+foodNutrientDocument._id);
                    });
                }) //.then

            }
            else{ //food in database - make link
              foodItem.foodNutrients = nutrientqueryResult._id;
              console.log("attaching id to existing FoodItem: "+nutrientqueryResult._id);

            }
 
        })
        .catch(error=>{
          console.log(error);
        });
    */    
        next();
});

module.exports = mongoose.model("FoodItem", FoodItemSchema);
