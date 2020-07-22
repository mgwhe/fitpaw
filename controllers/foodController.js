"use strict";

const { default: validator } = require("validator");
const { findByIdAndUpdate } = require("../models/user");

const User = require("../models/user"),
httpStatus = require("http-status-codes"),  
FoodDiaryDay = require("../models/food_diary_day"),
//FoodItem = require("../models/food_diary_item"),
FoodNutrients=require("../models/food_nutrients"),
axios = require('axios'),
mongoose = require("mongoose"),
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
      FoodDiaryDay.findOne({foodDiaryDayDate:thisDate, userRef:currentUser._id})
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

    

    addFoodBasketItemsToDiary: async (req, res, next) => {
      let currentUser = res.locals.currentUser;
    
      if (currentUser) {
          
          let foodDate = helpers.fixDate(req.body.foodDate); //set date to yyyy-MM-DD 
  
          let foodBasketContents = JSON.parse(req.body.foodBasketContents);

          let maxMealCount =0;
  
          let foodDiaryDay = await FoodDiaryDay.findOne({"foodDiaryDayDate": foodDate})
          .where('userRef').equals(currentUser.id).exec(); 
           
  
          if(foodDiaryDay == null){
            console.log("about to create FoodDiaryDay");
              await FoodDiaryDay.create({userRef:currentUser.id,foodDiaryDayDate:foodDate,foodDiaryItems: new Array()})
            .then(newFoodDiaryDay=>{
              foodDiaryDay = newFoodDiaryDay;
                console.log("Max meal number is: "+maxMealCount);
            })
          }
          else{ //diaryday exists

              //Find maximum value of a meal witihn an array of FoodItems 
              //source: https://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects
              maxMealCount = Math.max(...foodDiaryDay.foodDiaryItems.map(o => o.mealNumber), 0);
              console.log("Max meal number is: "+maxMealCount);
            }
                
            //You MUST use a for loop or at least NOT use forEach loop if using await 
            //picked up from StackOverflow comments. Details unknown only it works!!
            for (var index = 0; index < foodBasketContents.length; index++) {
              console.log(foodBasketContents[index]);

              var basketFoodName = foodBasketContents[index].foodName.trim().toLowerCase();

              let foodNutrientsID;
              await FoodNutrients.create({foodName:basketFoodName})
                  .then(foodNutrients=>{
                    foodNutrientsID = foodNutrients._id;
                    console.log("foodNutrientsID"+foodNutrientsID);
                  })
                  .catch(error =>{
                    console.log("Error creating new nutrient document: "+error);
                  });

             
              foodDiaryDay.foodDiaryItems.push({
                foodName:basketFoodName,
                foodUnits:foodBasketContents[index].foodUnits,
                foodQuantity:foodBasketContents[index].foodQuantity,
                foodNutrients: foodNutrientsID,
                mealNumber:maxMealCount+1 
              });  

            }

            foodDiaryDay.save();  
/*
            foodBasketContents.forEach(foodBasketItem =>{
                        
              var basketFoodName = foodBasketItem.foodName.trim().toLowerCase();
           
              let foodNutrientsID;
              await FoodNutrients.create({foodName:basketFoodName})
                  .then(foodNutrients=>{
                    foodNutrientsID = foodNutrients._id;
              })

              foodDiaryDay.foodDiaryItems.push({
                foodName:basketFoodName,
                foodUnits:foodBasketItem.foodItemUnits,
                foodQuantity:foodBasketItem.foodQuantity,
                foodNutrients: foodBasketItem.foodNutrientsID,
                mealNumber:maxMealCount+1 
              });  

              foodDiaryDay.save();  

              }) //forEach
              
*/
            next();

      } //if user
   
    },
/*
    saveFoodsFromBasket: (req, res, next) => {
      let currentUser = res.locals.currentUser;
      
    //  let foodDate = req.body.foodDate;

      if (currentUser) {

          let foodItemIDs = [];

          let foodBasketContents = JSON.parse(req.body.foodBasketContents);
              
            foodBasketContents.forEach(foodItem =>{
              let foodName = newFoodItem.foodName.trim().toLowerCase();

                FoodNutrients.findOne( {"foodName": foodName})
                .then(nutrientqueryResult=>{
                    if(nutrientqueryResult===null){ //food nutrients not known to FitPaw database 
                      console.log("No such food in FitPaw DB");
                        //Get nutrients from Nutritionix via API
                        helpers.getNutrients(foodName) //Issue resolved - needed to do .then as API call is async and using let will return too early!!
                        .then(nutrientAPIResults=>{
                            FoodNutrients.create(helpers.assignNutrientAPIResultsToFoodNutrients(nutrientAPIResults)).exec();
                        })
                    } //if

                  })
                }) //.then
            }) //foreach

          

                FoodItem.findOne({foodName:foodNutrients.foodName})
                                .then((foodItem)=>{
                                  findByIdAndUpdate(foodItem._id,{foodNutrients:foodNutrients._id}).exec();
                FoodItem.create(foodItem)
                .then((newFoodItem)=>{
               
              
                foodItemIDs.push(newFoodItem._id); //Add newFoodItem._id to array, so at the end pass on on addFoodsToDiary call which saves to FoodDay
                            
                console.log(newFoodItem._id);
                console.log(newFoodItem.foodName);
              }
              .catch(error=>{ //FoodNutrients.findOne( {"foodName": foodName})
                console.log("Error: "+error);
              }); //.catch  
            }) //FoodItem.create(foodItem)

          })//forEach
          
      } //if user
      
    },
*/
    
    
    addFoodToDiary: async (req, res, next) => {
      console.log("addFoodToDiary");

      const currentUser = res.locals.currentUser;
      const foodDate = helpers.fixDate(req.body.foodDate); //set date to yyyy-MM-DD 
      const foodItem = JSON.parse(req.body.foodItem);
      const foodItemName = foodItem.foodName.trim().toLowerCase();
      const foodItemUnits = foodItem.foodUnits.trim().toLowerCase();
      const foodItemQuantity = foodItem.foodQuantity.trim().toLowerCase();
      let IsNewNutrient = true;
      
      if (currentUser) {

        let foodNutrientsID; //=mongoose.Types.ObjectId();

        await FoodNutrients.findOne({foodName:foodItemName})
          .then( foodMatch=>{
              if(foodMatch == null)
              {
                IsNewNutrient = true;

                FoodNutrients.create({foodName:foodItemName})
                .then(foodNutrients=>{
                  
                //newFoodItem.foodNutrients = foodNutrients._id;
                foodNutrientsID = foodNutrients._id;

                console.log("New: newFoodItem.foodNutrients: "+foodNutrientsID);
                  
                }) 
              }
              else{
                IsNewNutrient = false;
                
                //  newFoodItem.foodNutrients = foodNutrients._id;
                foodNutrientsID = foodNutrients._id;
                
                console.log("Existing: newFoodItem.foodNutrients: "+foodNutrientsID);

              }
          })
  
          //check if diary Day exists
          FoodDiaryDay.findOne( {"foodDiaryDayDate": foodDate})
          .where('userRef').equals(currentUser.id) 
          .then(foodDiaryDay=>{

              //Food diary day with all food diary items for the logged in user
              var maxMealCount =0;

              if(foodDiaryDay == null){
                  console.log("about to create FoodDiaryDay");
                  FoodDiaryDay.create({userRef:currentUser.id,foodDiaryDayDate:foodDate, foodDiaryItems: new Array()})
                  .then((foodDiaryDay)=>{

                      foodDiaryDay.foodDiaryItems.push({
                        foodName:foodItemName,
                        foodUnits:foodItemUnits,
                        foodQuantity:foodItemQuantity,
                        foodNutrients: foodNutrientsID,
                        mealNumber:maxMealCount+1 //need to sort
                      });  
      
                      foodDiaryDay.save();  
                              
                  });
              
              }
             else{ //Add food item to matched FoodDiaryDay
             

                foodDiaryDay.foodDiaryItems.push({
                  foodName:foodItemName,
                  foodUnits:foodItemUnits,
                  foodQuantity:foodItemQuantity,
                  foodNutrients: foodNutrientsID,
                  mealNumber:maxMealCount+1 //need to sort
                });  

                foodDiaryDay.save(); 

                //Find current maximum value of a meal witihn an array of FoodItems before new is added
                //source: https://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects
           //      maxMealCount = Math.max(...foodDiaryDay.foodDiaryItems.map(o => o.mealNumber), 0);
                console.log("Max meal number is: "+maxMealCount);
             }
                ////
                if(IsNewNutrient === true){
                  //Get nutrients from Nutritionix via API and update  
                  helpers.getNutrients(foodItemName) //Issue resolved - needed to do .then as API call is async and using let will return too early!!
                  .then(nutrientAPIResults=>{
                      //find and update based on API call
                      FoodNutrients.findOneAndUpdate(
                        {foodName: foodItemName},
                        helpers.assignNutrientAPIResultsToFoodNutrients(nutrientAPIResults)
                      )
                      .exec();
                  })
                }

               next();
            })

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




