"use strict";

//get reference to mongoose module and store in varaiable mongoose 
const mongoose = require("mongoose"),
validator = require ("validator"), //validate e-mails, etc. 
User = require("./user");

const ActivityTrackSchema = new mongoose.Schema({ 
    activityTrackDistanceMetres: {
        type:Number, 
        required: true
    },
    activityTrackTimeSeconds:{
        type:Number,
        required:true
    },
    activityTrackDate: {
        type: Date,
        required: true
    },
    userRef: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
},
{ //timestamp each record when created & updated
  timestamps: true
});

module.exports = mongoose.model("ActivityTrack", ActivityTrackSchema);