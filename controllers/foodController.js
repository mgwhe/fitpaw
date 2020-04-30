"use strict";

const User = require("../models/user"),
FoodDiaryDay = require("../models/food_diary_day");

module.exports = {

    filterFoodDiaryDay: (req, res, next) => {
        let currentUser = res.locals.currentUser;
        var date = "";

        if (currentUser) {
            // FoodDiaryDay.find({}).where("foodDiaryDayDate").equals(date)
            // lookup food for user for user
            FoodDiaryDay.findOne({foodDiaryDayDate:'2020-04-20', userRef:currentUser._id})
            .then(diaryDay=>{
                if(diaryDay!==undefined){
                  res.locals.foodItems = diaryDay.foodItems; //do I need to call populate????
                }   
                next();
              });
        } //if 
    },
    
    showFoodDiaryDayView: (req, res) => {
      res.render("food/show");
    }
}