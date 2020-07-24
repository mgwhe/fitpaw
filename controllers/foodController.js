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
                console.log("Max meal number is: "+maxMealCount);
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
    
    //Lookup last 7 days of food nutrients. 
  fitpawDBLookupNutrientsForDatePeriod: async (req,res,next)=>{

      let currentUser = res.locals.currentUser;

      let startDate = req.params.startDate;
      let endDate = req.params.endDate;

      console.log("req.params.startDate: "+req.params.startDate);
      console.log("req.params.endDate: "+req.params.endDate);

      if (currentUser) {
        
    //      endDate = new Date().toISOString().substring(0,10);
    //      startDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().substring(0,10); //A week ago
          
          console.log("start date: "+startDate);
          console.log("end date: "+endDate);

          let nutrientIDs =[];
          let nutrients =[];

          await FoodDiaryDay.find({"foodDiaryDayDate": {"$gte": startDate, "$lte": endDate}})
          .where('userRef').equals(currentUser.id).populate('foodNutrients')
          .then(diaryDays=>{
                console.log(JSON.stringify(diaryDays));
                diaryDays.forEach(diaryDay=>{
                  diaryDay.foodDiaryItems.forEach(foodItem=>{
                    console.log(JSON.stringify(foodItem.foodNutrients._id)); 
                    nutrientIDs.push(foodItem.foodNutrients._id); 
                  })
                })
            //     console.log(JSON.stringify(result.foodDiaryItems[0].foodNutrients._id));
          })
         
            //lookup the nutrients for each food based on the id
            for (var index = 0; index < nutrientIDs.length; index++) {
        
                let details =  await FoodNutrients.findById(nutrientIDs[index]).exec();
         //       console.log(details);
                nutrients.push(details);
              }
 
              console.log(JSON.stringify("what is being dumped here:"));
            nutrients.forEach(nutrient=>{
              console.log(JSON.stringify(nutrient))
            })
            
            res.locals.foodItems = nutrients;

           
    /*    } //if(req.params.frequency === "daily")
        else{
          console.log("Only works for daily!");
        }
        */
        next();
      } //if(currentuser)
      
    },


    //Lookup food nutrient totals for date
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
          .where('userRef').equals(currentUser.id).populate('foodNutrients')
          .then(diaryDays=>{
                diaryDays.forEach(diaryDay=>{
                  diaryDay.foodDiaryItems.forEach(foodItem=>{
                    console.log(JSON.stringify(foodItem.foodNutrients._id)); 
                    nutrientIDs.push(foodItem.foodNutrients._id); 
                  })
                })
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
              nutrientSums.push(sum);
              console.log("Nutrient: "+nutrientKeyName +" sum: "+ sum);
            })
            
            console.log("Dumping.."+JSON.stringify(nutrientSums));

            res.locals.foodItemTotals = nutrientSums;

            ////NEED TO SCALE!!!

            next();
      } //if(currentuser)
      
      
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

//not used??
/*
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
*/
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




