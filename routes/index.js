"use strict";

//Master list of all routers from all files in this directory
//Divided up by each resource types
const router = require("express").Router(), 

//Get references to each route file so can use in router mapping 
homeRoutes = require("./homeRoutes"), 
errorRoutes = require("./errorRoutes"),
memberRoutes = require("./memberRoutes"),
petRoutes = require("./petRoutes"); 

//Map each path to a route file for sub-mappings 
router.use("/",homeRoutes);
router.use("/petprofile",petRoutes);
router.use("/memberprofile",memberRoutes);
router.use("/", errorRoutes);

module.exports =router;
