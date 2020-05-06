"use strict";

const User = require("../models/user"),
httpStatus = require("http-status-codes"),  
FoodDiaryDay = require("../models/food_diary_day");

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

    createFood: (req, res, next) => {
     console.log("create food");
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