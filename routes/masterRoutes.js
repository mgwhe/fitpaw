"use strict";

const router = require("express").Router(),  

masterController = require("../controllers/masterController"); 

router.get("/", masterController.getMasterPage);
   
module.exports = router; //Make router object set above avaialble outside this file
