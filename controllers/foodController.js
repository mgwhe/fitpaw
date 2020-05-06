"use strict";

const User = require("../models/user"),
httpStatus = require("http-status-codes"),  
FoodDiaryDay = require("../models/food_diary_day"),
FoodItem = require("../models/food_diary_item"),
getFoodItemParams = body => {
  return {
    foodName: body.foodName,
    foodQuantity: body.foodQuantity,
    foodUnits: body.foodUnits
  };
};

module.exports = {

    filterFoodDiaryDay: (req, res, next) => {
        let currentUser = res.locals.currentUser;
       
       // const query = req.query;
        let thisDate = req.params.thisDate;

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

    create: (req, res, next) => {
      let currentUser = res.locals.currentUser;
      let foodParams =  getFoodItemParams(req.body);
      let foodDate = req.body.foodDate;

      if (currentUser) {
          var stuff = getFoodItemParams(req.body);
        
          console.log(stuff);
          console.log("after");
          //validate data
         
          //check if diary Day exists
          FoodDiaryDay.findOne( {"foodDiaryDayDate": req.body.foodDate})
          .where('userRef').equals(currentUser.id) 
          .then(foodDiaryDay=>{
            if(foodDiaryDay == null){
              console.log("about to create FoodDiaryDay");
              foodDiaryDay= new FoodDiaryDay({userRef:currentUser.id,foodDiaryDayDate:foodDate});
              foodDiaryDay.save();
            }

            let newFoodItem = new FoodItem(foodParams);
            newFoodItem.save();
            foodDiaryDay.foodDiaryItems.push(newFoodItem._id);    
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
    
    redirectView: (req, res) => {
      res.render("food/add");
    },

    respondJSON: (req, res) => {
      res.json({
        status: httpStatus.OK,
        data: res.locals
      });
    },
}