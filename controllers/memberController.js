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

exports.getSubscriptionPage = (req, res) => {
  res.render("contact");
};
*/

exports.saveMemberProfile = (req, res) => {
  let newMemberProfile = new MemberProfile({
    email: req.body.email,
    memberName: req.body.name,
    startDate: new Date(now)
  });
  newMemberProfile
    .save()
    .then(result => {
      res.render("thank you!");
    })
    .catch(error => {
      if (error) res.send(error);
    });
};