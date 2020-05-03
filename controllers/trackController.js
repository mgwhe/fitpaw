"use strict";

const User = require("../models/user"),
httpStatus = require("http-status-codes"),
path = require('path');

module.exports = {

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
    
    showTrackView: (req, res) => {
        res.render("track/show");

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