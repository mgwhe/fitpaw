"use strict";

//Master list of all routers from all files in this directory
//Divided up by each resource types
const router = require("express").Router(), 

homeRoutes = require("./homeRoutes"), 
errorRoutes = require("./errorRoutes"),
memberRoutes = require("./memberRoutes"),
petRoutes = require("./petRoutes"); 

router.use("/",homeRoutes);
router.use("/petprofile",petRoutes);
router.use("/memberprofile",memberRoutes);
router.use("/", errorRoutes);

module.exports =router;
