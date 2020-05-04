"use strict";

const User = require("../models/user"),
httpStatus = require("http-status-codes"),
path = require('path');

module.exports = {

    captureActivity: (req, res, next) => {
        let currentUser = res.locals.currentUser;
       
       // const query = req.query;
        let location = req.params.location;

        if (currentUser) {
            //store co-ordinate

            //return co-ordinate to map
            res.locals.location = location;
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
    
    addTrackView: (req, res) => {
        res.render("track/add");

      },

      returnStaticMap:(req, res) => {
        //res.render("track/show");
        res.sendFile(path.join(__dirname, '../public','routeMap.html'));
      },

    respondJSON: (req, res) => {
      res.json({
        status: httpStatus.OK,
        data: res.locals
      });
    },
}