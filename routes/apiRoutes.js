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
  

router.get("/food/lookup/:foodName", foodController.nutritionDBLookup, foodController.respondJSON); //foodName - refer to in code
router.get("/food/:thisDate", foodController.filterFoodDiaryDay, foodController.respondJSON);

//need to change to put
//router.get("/track/:activity", trackController.saveTrack, trackController.respondJSON);
router.get("/track/", trackController.index, trackController.respondJSON);


module.exports = router; //Make router object set above avaialble outside this file
