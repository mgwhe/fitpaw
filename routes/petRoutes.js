"use strict";

const router = require("express").Router(),  

petController = require("../controllers/petController"); 


//When someone types or links to http://localhost:3000/petprofile in browser then go to call getPetProfile() method which
//gets the pet profile and stores it in the request object req. 3rd parameter calls a function uses this data 
//to send back to web page
router.get("/", petController.getPetProfile, (req, res) => {
  console.log("here");  
  console.log(req.data);
    res.send(req.data);
  }); 



module.exports = router; //Make router object set above avaialble outside this file
