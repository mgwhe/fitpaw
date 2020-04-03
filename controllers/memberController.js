"use strict";

const MemberProfile = require("../models/member_profile");

/*
exports.getAllSubscribers = (req, res) => {
  Subscriber.find({})
    .exec()
    .then(subscribers => {
      res.render("subscribers", {
        subscribers: subscribers
      });
    })
    .catch(error => {
      console.log(error.message);
      return [];
    })
    .then(() => {
      console.log("promise complete");
    });
};
*/
exports.getMemberProfilePage = (req, res) => {
  res.render("memberprofile");
};

exports.saveMemberProfile = (req, res) => {
  let newMemberProfile = new MemberProfile({
    email: req.body.email,
    memberName: req.body.name,
    startDate: new Date() //sets to the current date/time
  });
  newMemberProfile
    .save()
    .then(result => {
      res.render("thanks");
    })
    .catch(error => {
      if (error) res.send(error);
    });
};