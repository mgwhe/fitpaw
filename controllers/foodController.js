"use strict";

const User = require("../models/user"),
FoodDiary = require("../models/food_diary");


module.exports = {

    filterFoodDays: (req, res, next) => {
    let currentUser = res.locals.currentUser;
    if (currentUser) {
       
         currentUser.foodDiary.findOne({}).where("foodDiaryDayDate").equals(date)
        
        //course.toObject() converts to JSON
        return foodDiaryDay.toObject();

        res.locals.courses = foodDiaryDay;
      next();
    } else {
      next();
    }
  },

    /*

    showFoodDay: (req, res, next) => {
        let Id = req.params.id;
        FoodDiary.findById(courseId)
          .then(course => {
            res.locals.course = course;
            next();
          })
          .catch(error => {
            console.log(`Error fetching course by ID: ${error.message}`);
            next(error);
          });
      },
      */
    
    showFoodDayView: (req, res) => {
        res.render("courses/show");
      },
    

 
  
}