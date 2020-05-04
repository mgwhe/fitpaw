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

            next();
        } //if
    },

    saveTrack: (req, res, next) => {
        let currentUser = res.locals.currentUser;
       
        const query = req.query;

        if (currentUser) {
            //extract activity data

            //store trasck data
        /*    ActivityTrack.create({userRef:'5eabd95a216c0a38bce63884',foodDiaryDayDate:'2020-04-01'})
            .then(diaryDay=>{
            });
            */

            res.locals.query = "here";


            next();
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