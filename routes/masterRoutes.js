"use strict";

const router = require("express").Router(),  

masterController = require("../controllers/masterController"); 

//need to code out
//here is a change
//supress menu option to edit/update pet profile
//router.get("/no_pet_profile", masterController.getMasterPageNoPetProfile);
//otherwise..
router.get("/", masterController.getMasterPage);

module.exports = router; //Make router object set above avaialble outside this file
