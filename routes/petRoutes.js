"use strict";

const router = require("express").Router(),  

petController = require("../controllers/petController"); 


//All routes below are **relative** to path in index.js 

//When someone types or links to http://localhost:3000/petprofile in browser then go to call getPetProfile() method which
//gets the pet profile and stores it in the request object req. 3rd parameter calls a function uses this data 
//to send back to web page

/*
router.get("/", petController.getPetProfile, (req, res) => {
  console.log(req.data);
    res.send(req.data);
  }); 
*/

//router.get("", petController.index, petController.indexView);

//used to call the new pet profile form
router.get("/new", petController.new);
//used to submit new pet details on form
router.post("/create", petController.create, petController.redirectView);

//router.get("/:id/edit", petController.edit);
//router.put("/:id/update", petController.update, petController.redirectView);

router.get("/:id", petController.show, petController.showView);

//router.delete("/:id/delete", petController.delete, petController.redirectView);

//old version
//router.get("/", petController.getPetProfile);


module.exports = router; //Make router object set above avaialble outside this file
