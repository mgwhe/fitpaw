"use strict";

const PetProfile = require("../models/pet_profile");

exports.getPetProfile = (req, res) => {
    PetProfile.findOne({})
    .exec()
    .then(petprofile => {
      //render petprofile.ejs view & pass in name value containing data to display
      res.render("petprofile", {
        petprofile_variable: petprofile 
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

/*
exports.getPetProfile = (req, res) => {
    res.render("petprofile", {      //render used to render view files - name without extension 
     petprofile: pet
   } 
    );
};
*/

/*
exports.getSubscriptionPage = (req, res) => {
  res.render("contact");
};

exports.saveSubscriber = (req, res) => {
  let newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode
  });
  newSubscriber
    .save()
    .then(result => {
      res.render("thanks");
    })
    .catch(error => {
      if (error) res.send(error);
    });
};
*/
