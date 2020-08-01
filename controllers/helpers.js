"use strict";

const { default: validator } = require("validator");

const User = require("../models/user"),
httpStatus = require("http-status-codes"),  
FoodNutrients=require("../models/food_nutrients"),
FoodDiaryDay=require("../models/food_diary_day"),
axios = require('axios');
const { promiseImpl } = require("ejs");

const NUTRITIONIX_API_ENDPOINT_FOOD_QUERY = 'https://trackapi.nutritionix.com/v2/search/instant?query=';
const NUTRITIONIX_API_ENDPOINT_FOOD_NUTRIENTS = 'https://trackapi.nutritionix.com/v2/natural/nutrients';


//Add helper function to do lookup call
//https://stackoverflow.com/questions/38204545/how-do-i-call-one-controllers-method-in-another-controller-in-node
exports.getNutrients = function(foodName){

    //make remote call to nutrition database
    const url =  NUTRITIONIX_API_ENDPOINT_FOOD_NUTRIENTS; 
    const data = {query:foodName};
  
    //check look up food name before calling API
     if(validator.isAlpha(validator.blacklist(foodName, ' '))){
      return axios.post(url, data, {
        headers: {'x-app-key':'527d7ac47737983a2197102edde9b34a',
                  'x-app-id':'179643b1'
            }, //Add API keys for account
        } //axios.post
        )
        .then(response=>{
       //   console.log("in helper, after call dumping repsonse.data..");  
        //  console.log(JSON.stringify(response.data));
          
          let result = response.data; //This saved my project. return response.data alone does NOT pass back data!!!!!
          return result;
        })
        .catch(error=>{
          console.log(error);
        });
      } //if
      else{
          return null;
      }
  } //getNutrients

  //Extract relevent nutrient information from API call to Nutritionix service 
  //and assign to FoodNutrient object
  exports.assignNutrientAPIResultsToFoodNutrients = function(nutrientAPIResults){
   
    console.log("In helpers: "+nutrientAPIResults.foods[0].food_name);
     

    let foodNutrients = {  
      foodName: nutrientAPIResults.foods[0].food_name,
      foodReferenceQuantity: nutrientAPIResults.foods[0].serving_qty,
      foodServingUnit:nutrientAPIResults.foods[0].serving_unit,
      foodServingWeightGrams:nutrientAPIResults.foods[0].serving_weight_grams,
      ndb_no:nutrientAPIResults.foods[0].ndb_no,
      calories: nutrientAPIResults.foods[0].nf_calories,
      fat: nutrientAPIResults.foods[0].nf_total_fat,
      protein: nutrientAPIResults.foods[0].nf_protein,
      carbohydrates: nutrientAPIResults.foods[0].nf_total_carbohydrate,
      fibre: nutrientAPIResults.foods[0].nf_dietary_fiber,
      fat_saturated: nutrientAPIResults.foods[0].nf_saturated_fat,
      sugar: nutrientAPIResults.foods[0].nf_sugars,
      sodium:nutrientAPIResults.foods[0].nf_sodium,
    }
    
    return foodNutrients;
    
  }

  exports.fixDate = function(foodDateString){
    //reverse month and days - from stackflow
    foodDateString = foodDateString.split("/").reverse().join("-");

    let foodDate = new Date(foodDateString);

    foodDate.setHours(12,0,0); //Make sure time is not mid-night or
    //ISO call will flip back one hour and hence to the previous date!! So just pick mid-day - not using time so does not matter
    
    foodDate = foodDate.toISOString().substring(0,10); //Trim off time or else Mongo date search wont match!!

    return foodDate;

  }

  exports.getNumberOfMealsforDay = async function(foodDate){

    let foodDiaryDay = await FoodDiaryDay.findOne({"foodDiaryDayDate": foodDate})
    .where('userRef').equals(currentUser.id).exec();
  
    //Find maximum value of a meal witihn an array of FoodItems 
    //algorithm source: https://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects
    let maxMealCount = Math.max(...foodDiaryDay.foodDiaryItems.map(o => o.mealNumber), 0);
    console.log("Max meal number is: "+maxMealCount);
      
    return maxMealCount;    

  }


  exports.getNutrientsTotalsForsDay = function(foodDate){

  }

  exports.getNutrientsTotalForNutrient = function(nutrients, name){
    //Based on: https://stackoverflow.com/questions/23247859/better-way-to-sum-a-property-value-in-an-array
    return nutrients.reduce( function(a, b){
        return a + b[name];
    }, 0);
  }

  exports.getNutrientKeyNames = async function(){
    let keys =[];

    //based on: https://stackoverflow.com/questions/38684419/mongoose-return-only-keys-from-a-document
    await FoodNutrients.findOne({})
    .then(result=>{
        keys = Object.keys(result._doc);
        console.log("inside: "+JSON.stringify(keys));
    });

    return keys; 

  }

  exports.scaleNutrientsBasedOnQuantity = function(details,foodQuantity){

      let scaledDetails = details.map(detail=>detail*foodQuantity);
      return scaledDetails;
  }

  exports.getReferenceActivityLevel = function(){
    
    let referenceActivityLevel = [1200,1200,1200,1200,1200,1200,1200];

    return referenceActivityLevel;
  }