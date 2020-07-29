"use strict";

const User = require("../models/user"),
httpStatus = require("http-status-codes"),
ActivityTrack = require("../models/activity_track"),
path = require('path');

module.exports = {

    
    index: (req, res, next) => {
        let currentUser = res.locals.currentUser;
       
        if (currentUser) {
            
            //featch graph data for past 7 days - date ordered
            var start = new Date();
            var end = new Date();
            start.setDate(end.getDate()-6); // a week ago

            ActivityTrack.find( {"activityTrackDate": {"$gte": start, "$lt": end}})
            .where('userRef').equals(currentUser.id) //filter for this user
            .sort({'activityTrackDate':-1})
            .then(activities=>{
               
                res.locals.activities = activities;
     
                next();
            })
            .catch(error => {
                console.log(`IW Error: ${error.message}`);
            });

        } //if
    },

    // /track/add/:duration.:distance", trackController.saveTrack, trackController.respondJSON);
    saveTrack: (req, res, next) => {
        let currentUser = res.locals.currentUser;
       
        let duration = req.params.duration;
        let distance = req.params.distance;

        if (currentUser) {
            //extract activity data & validate
            var d = parseInt(distance);
            var t = parseInt(duration);

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

