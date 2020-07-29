"use strict";

const router = require("express").Router(),  
trackController = require("../controllers/trackController"); 

router.get("/", trackController.index, trackController.indexView);
router.get("/add", trackController.captureTrackView);
//following moved to a API route as being called from popup
//router.get("/save", trackController.saveTrack, trackController.index, trackController.indexView);
router.get("/index", trackController.index, trackController.indexView);

module.exports = router;