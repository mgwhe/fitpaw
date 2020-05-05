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
            .sort({activityTrackDate: 'ascending'}) 
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

/* move to client side 
function getDaysOfWeekLabels(){
    var tmpDate = new Date();
    var daysOfWeekLabels ="[";
    var i;

    tmpDate.setDate(tmpDate.getDate()-7); //start a week ago

    for(i=0;i<7;i++)
    { 
    var tmpDayString = tmpDate.toString().split(' ')[0];         
    tmpDate.setDate(tmpDate.getDate() + 1);
    //   daysOfWeekLabels = daysOfWeekLabels + tmpDayString + ",";
    daysOfWeekLabels =daysOfWeekLabels.concat("\'",tmpDayString,"\',");
    }
    //remove last comma
    daysOfWeekLabels = daysOfWeekLabels.substring(0, daysOfWeekLabels.length - 1);
    daysOfWeekLabels = daysOfWeekLabels + "]";

    return daysOfWeekLabels;
}
*/