"use strict";

const router = require("express").Router(),  

masterController = require("../controllers/userController"); 

router.post("/login", userController.authenticateWithAPI);
   
module.exports = router; //Make router object set above avaialble outside this file
