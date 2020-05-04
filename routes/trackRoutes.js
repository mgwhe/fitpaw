"use strict";

const router = require("express").Router(),  
trackController = require("../controllers/trackController"); 

router.get("/routeMap", trackController.returnStaticMap);
router.get("/:thisDate", trackController.processTrack, trackController.addTrackView);

module.exports = router;