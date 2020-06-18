
"use strict";

const router = require("express").Router(),  
foodController = require("../controllers/foodController"); 

//Keep routes with params lower in sequence or risk falsely triggering later routes as a
//constant to the :id instead of it being unique
//I think /xyz will trigger /:id using a value of xyz !! 
router.get("/", foodController.filterFoodDiaryDay, foodController.showFoodDiaryDayView);
router.get("/add/", foodController.add, foodController.redirectView);  

router.post("/create", foodController.create, foodController.redirectView);

router.get("/:thisDate", foodController.filterFoodDiaryDay, foodController.showFoodDiaryDayView);
router.put("/:thisDate", foodController.filterFoodDiaryDay, foodController.showFoodDiaryDayView);


/*
router.post(
    "/create",
   // foodController.validate,
    foodController.create,
    foodController.redirectView
  );
  */
/*
router.post("/food/:id/add", foodController.add, foodController.respondJSON);
*/
/*
router.get(
  "/fooddiaryday",
  foodController.index,
  foodController.filterDiary,
  foodController.respondJSON
);
*/

/* here is a change - just to test GIT */

module.exports = router;

