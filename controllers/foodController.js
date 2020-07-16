"use strict";

const { default: validator } = require("validator");

const User = require("../models/user"),
httpStatus = require("http-status-codes"),  
FoodDiaryDay = require("../models/food_diary_day"),
FoodItem = require("../models/food_diary_item"),
FoodNutrients=require("../models/food_nutrients"),
axios = require('axios'),
helpers = require("./helpers"),
getFoodItemParams = body => { //ES6 syntax using arrow function
  return {
    foodName: body.foodName,
    foodQuantity: body.foodQuantity,
    foodUnits: body.foodUnits
  };
};

const NUTRITIONIX_API_ENDPOINT_FOOD_QUERY = 'https://trackapi.nutritionix.com/v2/search/instant?query=';
const NUTRITIONIX_API_ENDPOINT_FOOD_NUTRIENTS = 'https://trackapi.nutritionix.com/v2/natural/nutrients';


module.exports = {

    filterFoodDiaryDay: (req, res, next) => {
        let currentUser = res.locals.currentUser;
        var thisDate;

       //if called without date food/ use today's date by default
       if(req.params.thisDate == null)
       {
          console.log("/food/ type call"); //use today's date as default
          thisDate = new Date().toISOString().substring(0,10);
       }
       else{
          console.log("/food/yyyy-mm-dd type call");
          thisDate = req.params.thisDate;
       }
        
        if (currentUser) {
            // FoodDiaryDay.find({}).where("foodDiaryDayDate").equals(date)
            // lookup food for user for user
      //      FoodDiaryDay.findOne({foodDiaryDayDate:'2020-05-01', userRef:currentUser._id}).populate("foodDiaryItems")
      FoodDiaryDay.findOne({foodDiaryDayDate:thisDate, userRef:currentUser._id}).populate("foodDiaryItems")
      .then(diaryDay=>{
                if(diaryDay!==undefined && diaryDay!==null){
                  if(diaryDay.foodDiaryItems!==undefined){
                    res.locals.foodItems = diaryDay.foodDiaryItems; 
                  }
                  else{
                    res.locals.foodItems = new Array(); 
                  }
                }   
                next();
              }) //.then
              .catch(error => {
                console.log(`IW Error: ${error.message}`);
              });
        } //if
    },
    
    showFoodDiaryDayView: (req, res) => {
      res.render("food/show");
    },

    addFoodBasketItemsToDiary: (req, res, next) => {
      let currentUser = res.locals.currentUser;
      
    //  let foodDate = req.body.foodDate;

      if (currentUser) {
          
          let foodDateString = req.body.foodDate;
          //reverse month and days
          foodDateString = foodDateString.split("/").reverse().join("-");

          let foodDate = new Date(foodDateString);

          foodDate.setHours(12,0,0); //Make sure time is not mid-night or
          //ISO call will flip back one hour and hence to the previous date!! So just pick mid-day
          
          foodDate = foodDate.toISOString().substring(0,10); //Trim off time or else Mongo date search wont match!!
 
          let foodBasketContents = JSON.parse(req.body.foodBasketContents);
          //check if diary Day exists
          FoodDiaryDay.findOne( {"foodDiaryDayDate": foodDate})
          .where('userRef').equals(currentUser.id).populate("foodDiaryItems") 
          .then(foodDiaryDay=>{

            if(foodDiaryDay == null){
              console.log("about to create FoodDiaryDay");
              foodDiaryDay= new FoodDiaryDay({userRef:currentUser.id,foodDiaryDayDate:foodDate});
            }
            
           //Find maximum value of a meal witihn an array of FoodItems 
           //source: https://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects
          const maxMealCount = Math.max(...foodDiaryDay.foodDiaryItems.map(o => o.mealNumber), 0);
          console.log("Max meal number is: "+maxMealCount);

            foodBasketContents.forEach(foodItem =>{
              let newFoodItem = new FoodItem(foodItem);
          
              let foodName = foodItem.foodName.trim();
              
              helpers.getNutrients(foodName)
              .then(nutrients=>{
                console.log(JSON.stringify(nutrients));
              })
              .catch(error=>{
                  console.log("Error: "+error);
              });
             
              let foodNutrients = new FoodNutrients();

           //   foodNutrients.calories = nutrientsJSON.foods
          

              newFoodItem.mealNumber = maxMealCount+1;
              
              newFoodItem.save();
              foodDiaryDay.foodDiaryItems.push(newFoodItem._id);  
            
              console.log(newFoodItem._id);
              console.log(newFoodItem.foodName);
            }) 

            foodDiaryDay.save();

            console.log("foodDiaryDay.foodDiaryItems.length= "+foodDiaryDay.foodDiaryItems.length);
            
          })
          .catch(error => {
            console.log(`Error: ${error.message}`);
            next(error);
          });

          next();
      } //if user
   
     },

    add: (req, res, next) => {
     console.log("route to form for adding food to diary");
   //  let thisDate = req.params.thisDate;
     next();
    },

    analysis:(req,res,next)=>{
      let currentUser = res.locals.currentUser;
      
      if (currentUser) {
     //   if(req.params.foodName != null)
     //   {
     //   }
        console.log("analysis");

        next();
      } //if(currentUser)
      
    },
    
    nutritionDBLookupFoods:(req,res,next)=>{
      let currentUser = res.locals.currentUser;
      
      if (currentUser) {
        if(req.params.foodName != null)
        {
            //make remote call to nutrition database
            const url =  NUTRITIONIX_API_ENDPOINT_FOOD_QUERY + req.params.foodName; 
            
            axios.get(url, {
              headers: {'x-app-key':'527d7ac47737983a2197102edde9b34a',
                        'x-app-id':'179643b1'
                  } //Add API keys for account
              })
              .then(response=>{
                res.locals.foodNames = JSON.stringify(response.data);
                next();
              })
              .catch(error=>{
                console.log(error);
              });
           
        } //if(req.params.foodName != null)
        else{
          console.log("Food name is null!!");
        }
        
      } //if(currentuser)
      
    },

    //hold
    nutritionDBLookupCalories:(req,res,next)=>{
      let currentUser = res.locals.currentUser;

      console.log("called nutritionDBLookupCalories");
      
      if (currentUser) {
        next();
      }
    },

    nutritionDBLookupNutrients:(req,res,next)=>{
      let currentUser = res.locals.currentUser;
      
      if (currentUser) {
        if(req.params.foodName != null)
        {
            //make remote call to nutrition database
            const url =  NUTRITIONIX_API_ENDPOINT_FOOD_NUTRIENTS; 
            const data = {query:req.params.foodName};

            //check look up food name before calling API, ignore spaces
            if(validator.isAlpha(validator.blacklist(req.params.foodName, ' '))){
              axios.post(url, data, {
                headers: {'x-app-key':'527d7ac47737983a2197102edde9b34a',
                          'x-app-id':'179643b1'
                    }, //Add API keys for account
                }
                )
                .then(response=>{
                  res.locals.foodNameNutrients = JSON.stringify(response.data);
                  next();
                })
                .catch(error=>{
                  console.log(error);
                });
            }
            else{
              console.log("Food name has invalid characters");
            }
            
           
        } //if(req.params.foodName != null)
        else{
          console.log("Food name is null!!");
        }
        
      } //if(currentuser)
      
    },

    redirectView: (req, res) => {
      res.render("food/add");
    },

    analysisView: (req, res) => {
              
      res.render("food/analysis");
    },

    respondJSON: (req, res) => {
      res.json({
        status: httpStatus.OK,
        data: res.locals
      });
    },

    
} //module.exports




