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

    filterFoodDiaryDay: async (req, res, next) => {
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
          let diaryDay = await FoodDiaryDay.findOne({foodDiaryDayDate:thisDate, userRef:currentUser._id}).exec();
      
            if(diaryDay!==undefined && diaryDay!==null){
              if(diaryDay.foodDiaryItems!==undefined){

                let foodItems = diaryDay.foodDiaryItems; 
                            
                //fill in the calories
                for (var index = 0; index < foodItems.length; index++) {

                    let nutrients = await FoodNutrients.findOne({foodName:foodItems[index].foodName}).exec();
                    foodItems[index].calories  = nutrients.calories;

                    console.log("calories for food "+nutrients.calories);
                }
                res.locals.foodItems = foodItems; 
              }
              else{
                res.locals.foodItems = new Array(); 
              }
            }   
            next();
             
        } //if
    },
    
    showFoodDiaryDayView: (req, res) => {
      res.render("food/show");
    },

    

    addFoodBasketItemsToDiary: async (req, res, next) => {
      let currentUser = res.locals.currentUser;
      let IsNewNutrient = true;
    
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
            })
          }
          else{ //diaryday exists

              //Find maximum value of a meal witihn an array of FoodItems 
              //source: https://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects
              maxMealCount = Math.max(...foodDiaryDay.foodDiaryItems.map(o => o.mealNumber), 0);
              console.log("Max meal number is: "+maxMealCount);
            }
                
            //If using await you MUST use a for loop or at least NOT use forEach loop if using await 
            //picked up from StackOverflow comments. Details unknown - related to iterators
            for (var index = 0; index < foodBasketContents.length; index++) {
              console.log(foodBasketContents[index]);

              var basketFoodName = foodBasketContents[index].foodName.trim().toLowerCase();

              let foodNutrientsID;
              //
              await FoodNutrients.findOne({foodName:basketFoodName})
                .then( foodNutrients=>{
                    if(foodNutrients == null)
                    {
                      IsNewNutrient = true;
      
                    }
                    else{
                      IsNewNutrient = false;
                      
                      //  newFoodItem.foodNutrients = foodNutrients._id;
                      foodNutrientsID = foodNutrients._id;
                      
                      console.log("Existing: newFoodItem.foodNutrients: "+foodNutrientsID);
      
                    }
                })
                
                if(IsNewNutrient===true)
                {
                  await FoodNutrients.create({foodName:basketFoodName})
                    .then(foodNutrients=>{
                  
                    foodNutrientsID = foodNutrients._id;

                    console.log("New: newFoodItem.foodNutrients: "+foodNutrientsID);
                  
                  }) 

                  console.log("Making call to Nutritionix for details of nutrients..");

                  //Get nutrients from Nutritionix via API and update  
                  await helpers.getNutrients(basketFoodName) //Issue resolved - needed to do .then as API call is async and using let will return too early!!
                    .then(nutrientAPIResults=>{
                        //find and update based on API call
                         FoodNutrients.findOneAndUpdate(
                          {foodName: basketFoodName},
                          helpers.assignNutrientAPIResultsToFoodNutrients(nutrientAPIResults)
                        )
                        .exec();
                    })
                } //if
              
             
              foodDiaryDay.foodDiaryItems.push({
                foodName:basketFoodName,
                foodUnits:foodBasketContents[index].foodUnits,
                foodQuantity:foodBasketContents[index].foodQuantity,
                foodNutrients: foodNutrientsID,
                mealNumber:maxMealCount+1 
              });  

            }

            foodDiaryDay.save();  

            next();

      } //if user
   
    },    
    
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

                  console.log("Making call to Nutritionix for details of nutrients..");

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

    
    //Lookup last 7 days of food nutrients. 
  fitpawDBLookupNutrientsForDatePeriod: async (req,res,next)=>{

      let currentUser = res.locals.currentUser;

      let startDate = req.params.startDate;
      let endDate = req.params.endDate;

      console.log("req.params.startDate: "+req.params.startDate);
      console.log("req.params.endDate: "+req.params.endDate);

      if (currentUser) {
          
          console.log("start date: "+startDate);
          console.log("end date: "+endDate);

          let nutrientIDs =[];
          let nutrients =[];
          
          let foodItemsDetails=[];

          await FoodDiaryDay.find({"foodDiaryDayDate": {"$gte": startDate, "$lte": endDate}})
          .where('userRef').equals(currentUser.id)
          .sort({'foodDiaryDayDate':-1}) //newest first
          .then(diaryDays=>{
                console.log(JSON.stringify(diaryDays));
                diaryDays.forEach(diaryDay=>{
                  diaryDay.foodDiaryItems.forEach(foodItem=>{
                    console.log(JSON.stringify(foodItem.foodNutrients._id)); 
                    nutrientIDs.push(foodItem.foodNutrients._id); 

                    //Add food quantity and meal number for the table display on the dashboard
                    //Add foodName for debugging & testing

                    foodItemsDetails.push({foodQuantity:foodItem.foodQuantity,mealNumber:foodItem.mealNumber,foodName:foodItem.foodName,createdAt:foodItem.createdAt,foodDate:foodItem.createdAt.toISOString().substring(5,10)});
                 
/*
                foodItemsDetails.push({foodQuantity:foodItem.foodQuantity,mealNumber:foodItem.mealNumber,foodName:foodItem.foodName,createdAt:foodItem.createdAt,foodDate:foodItem.parent.foodDiaryDayDate.toISOString().substring(5,10)});
      */

                  })
                })
            //     console.log(JSON.stringify(result.foodDiaryItems[0].foodNutrients._id));
          })
         
            //lookup the nutrients for each food based on the id
            for (var index = 0; index < nutrientIDs.length; index++) {
        
                let details =  await FoodNutrients.findById(nutrientIDs[index]).exec();
         //       console.log(details);
                //this scales the nutrients based on the base units
         //       details = helpers.scaleNutrientsBasedOnQuantity(details,foodItemsDetails[index].foodQuantity);
                nutrients.push(details);
              }
            
              nutrients.forEach(nutrient=>{
                console.log(JSON.stringify(nutrient))
              })

              foodItemsDetails.forEach(detail=>{
                console.log(JSON.stringify(detail));
              })
            
            res.locals.foodNutrients = nutrients;
            res.locals.foodItemsDetails = foodItemsDetails;
           
        next();
      } //if(currentuser)
      
    },

    //Lookup food nutrient totals for date range
    fitpawDBLookupNutrientsTotalsForDatePeriod: async (req,res,next)=>{

      console.log("Entering fitpawDBLookupNutrientsTotalsForDatePeriod.. ");
      
      let currentUser = res.locals.currentUser;

      let startDate = req.params.startDate;
      let endDate = req.params.endDate;

      console.log("req.params.startDate: "+req.params.startDate);
      console.log("req.params.endDate: "+req.params.endDate);
    
      if (currentUser) {
                
          let nutrientIDs =[];
          let nutrients =[];

          await FoodDiaryDay.find({"foodDiaryDayDate": {"$gte": startDate, "$lte": endDate}})
          .where('userRef').equals(currentUser.id)
          .sort({'foodDiaryDayDate':-1})
          .then(diaryDays=>{
                diaryDays.forEach(diaryDay=>{
                  diaryDay.foodDiaryItems.forEach(foodItem=>{
                    console.log(JSON.stringify(foodItem.foodNutrients._id)); 
                    nutrientIDs.push(foodItem.foodNutrients._id); 
                  })
                })
          })
          .catch(error=>{
            console.log("Error executing FoodDiaryDay.find: "+error);
          })  
         
            //lookup the nuttrients for each food item for the day
            for (var index = 0; index < nutrientIDs.length; index++) {
        
                let details =  await FoodNutrients.findById(nutrientIDs[index]).exec();
                nutrients.push(details);
            }

            //sum the food nutrients for the day
            let nutrientKeyNames = [   
                'calories',
                'fat', 
                'protein', 
                'carbohydrates',
                'fibre',
                'fat_saturated',
                'sugar',
                'sodium'
            ];

            let nutrientSums = [];

            nutrientKeyNames.forEach(nutrientKeyName=>{

              let sum = helpers.getNutrientsTotalForNutrient(nutrients,nutrientKeyName);

              //scale for qty consumed..
       //       sum = sum * 
              nutrientSums.push(sum);
              console.log("Nutrient: "+nutrientKeyName +" sum: "+ sum);
            })
            
            console.log("Dumping.."+JSON.stringify(nutrientSums));

            res.locals.foodItemTotals = nutrientSums;

            next();
      } //if(currentuser)
      
      
    },
 

    fitpawDBLookupNutrientsRDA: async (req,res,next)=>{

      console.log("Entering fitpawDBLookupNutrientsRDA.. ");
              
            let nutrientRDA = [ 
                400,
                80, 
                70, 
                80,
                80,
                50,
                20,
                15
              ];
        
            console.log("Dumping.."+JSON.stringify(nutrientRDA));

            res.locals.foodItemRDA = nutrientRDA;

            next();
      
    },

    fitpawDBLookupFoods:(req,res,next)=>{
      let currentUser = res.locals.currentUser;
      
      if (currentUser) {
        if(req.params.foodName != null)
        {
          let searchFoodName = req.params.foodName; 
        //regex regular expression which allows fuzzy matching
       FoodNutrients.find({foodName: { $regex: searchFoodName, $options: 'i' }, foodType: 'Branded'})
                .then( foodNutrients=>{
                    res.locals.foodNames = JSON.stringify(foodNutrients);
                   next();
                })
                .catch(error=>{
                  console.log(error);
                });
        }
      }
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




