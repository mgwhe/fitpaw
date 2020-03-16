"use strict";

const PetProfile = require("../models/pet_profile");


exports.getPetProfile = (req, res) => {
    PetProfile.findOne({petName:"Spot"})
    .exec()
    .then(petprofile => {
      //call petprofile(.ejs) view & pass in variable name:value containing data to display
      res.render("petprofile", {
        petprofile_variable: petprofile 
      });
     
    })
    .catch(error => {
      console.log(error.message);
      //to verify this return or return []?
      return [];
    })
    .then(() => {
      console.log("promise complete");
    });
};


/* example
exports.getAllSubscribers = (req, res, next) => { 
  Subscriber.find( {}, (error, subscribers) => {
    if (error) next( error);
    req.data = subscribers; 
    next(); 
  }); 
};
*/

//Simple version that prints to page without view - not working
/*
exports.getPetProfile = (req, res) => {
    PetProfile.findOne({petName:"Spot"})
    .exec()
    .then( (petprofile) => {
      req.data = petprofile;
    });
}
*/
/* DB test using Mongoose - works for console o/p
exports.getPetProfile = (req, res) => {
  PetProfile.findOne({petName:"Spot"}, function(error, petprofile) {
    if(error){
      return console.log("Error finding document!");
    }
    console.log(petprofile);
  });
}
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
