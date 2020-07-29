"use strict";

const router = require("express").Router(), 
httpStatus = require("http-status-codes"),  
passport = require("passport"),//remove if authn not done here 
userController = require("../controllers/userController"), 
foodController = require("../controllers/foodController"),
trackController = require("../controllers/trackController");

//router.post("/login", userController.authenticateWithAPI);


router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }

      console.log("login seems to have worked till here from modal click: ");    

      if (!user) { return res.redirect('/login'); }

      req.logIn(user, function(err) {
        if (err) { return next(err); }
    //    return res.redirect('/users/' + user.username);
   // return res.redirect("/master");
 //  return res.send('<script>window.close()</script>');
        return res.json({
            status: httpStatus.OK,
            data: res.locals
          });
      });

    })(req, res, next);
  });

/*
 router.post('/login', function(req, res) {
  passport.authenticate('local', function(req, res) {
  
    console.log("login seems to have worked till here from modal click: "+state);    
    res.redirect('/users/' + req.user.username);
  });
});
*/



//router.post('/foodbasket',foodController.saveFoodsFromBasket,foodController.addFoodsToDiary,foodController.respondJSON);
router.post('/foodbasket',foodController.addFoodBasketItemsToDiary,foodController.respondJSON);
//router.post('/foodbasket',foodController.addFoodBasketItemsToDiary,foodController.respondJSON);

router.post('/foodItem',foodController.addFoodToDiary,foodController.respondJSON);

             
router.get("/food_nutrients_totals/:startDate.:endDate", foodController.fitpawDBLookupNutrientsTotalsForDatePeriod,foodController.respondJSON); 

//Source on how to add two paramters to a GET call - choose a separator like . and use to seperate when sending using $get!
//https://expressjs.com/en/guide/routing.html
router.get("/food_nutrients/dates/:startDate.:endDate", foodController.fitpawDBLookupNutrientsForDatePeriod,foodController.fitpawDBLookupNutrientsTotalsForDatePeriod,foodController.fitpawDBLookupNutrientsRDA,foodController.respondJSON); //foodName - refer to in code

router.get("/food/calories/:frequency", foodController.nutritionDBLookupCalories,foodController.respondJSON); 

router.get("/food/lookup/:foodName", foodController.nutritionDBLookupFoods,foodController.respondJSON); //foodName - refer to in code
router.get("/food/lookup_branded/:foodName", foodController.fitpawDBLookupFoods,foodController.respondJSON);
//router.get("/food_nutrients/lookup/:foodName", foodController.nutritionDBLookupNutrients,foodController.respondJSON); //foodName - refer to in code

router.get("/food/:thisDate", foodController.filterFoodDiaryDay, foodController.respondJSON);

//Need to use special . between variable as sending in two 
router.get("/track/add/:duration.:distance", trackController.saveTrack, trackController.respondJSON);

//called to view activity grapth
router.get("/track/", trackController.index, trackController.respondJSON);

module.exports = router; //Make router object set above avaialble outside this file
