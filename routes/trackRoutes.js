"use strict";

const router = require("express").Router(),  
trackController = require("../controllers/trackController"); 

router.get("/:thisDate", trackController.processTrack, trackController.showTrackView);
    
module.exports = router;