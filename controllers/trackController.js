"use strict";

const User = require("../models/user"),
httpStatus = require("http-status-codes"),
ActivityTrack = require("../models/activity_track"),
path = require('path');

module.exports = {

    index: (req, res, next) => {
        let currentUser = res.locals.currentUser;
       
       // const query = req.query;
        let location = req.params.location;

        if (currentUser) {
            
            //featch graph data.. 
            //dump lot for now..
            ActivityTrack.find({})
            .then(activities=>{
                res.locals.activities = activities;
                next();
            })
            .catch(error => {
                console.log(`IW Error: ${error.message}`);
            });

        } //if
    },

    saveTrack: (req, res, next) => {
        let currentUser = res.locals.currentUser;
       
        const query = req.query;

        if (currentUser) {
            //extract activity data & validate
            var d = parseInt(query.distance);
            var t = parseInt(query.time);

            if(Number.isNaN(d)===false && Number.isNaN(t)===false)
            {
                var today = new Date();
                var tmpDateString = today.toISOString().split('T')[0];

                //store trask data
                ActivityTrack.create({
                    activityTrackDistanceMetres:d,
                    activityTrackTimeSeconds:t,
                    userRef:currentUser.id,
                    activityTrackDate:tmpDateString
                })
                .then(()=>{
                        next(); 
                })
                .catch(error => {
                        console.log(`IW Error: ${error.message}`);
                });
            }
            else
            {   
                console.log("Distance "+d+" is NOT a number"); 
                console.log("OR Time "+t+" is NOT a number"); 
            }         

        } //if
    },

    processTrack: (req, res, next) => {
        let currentUser = res.locals.currentUser;
       
       // const query = req.query;
        let thisDate = req.params.thisDate;

        if (currentUser) {
            //store co-ordinate
            //return co-ordinate to map
            next();
        } //if
    },
    
    captureTrackView: (req, res) => {
        res.render("track/add");

      },

    indexView: (req, res) => {
        res.render("track/index");
      },

    respondJSON: (req, res) => {
      res.json({
        status: httpStatus.OK,
        data: res.locals
      });
    },
}