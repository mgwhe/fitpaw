"use strict";

const PetProfile = require("../models/pet_profile"),
User = require("../models/user");


exports.getPetProfile = (req, res) => {
  //Call Mongoose findOne method on PetProfile model
    PetProfile.findOne({petName:"Spot"}) //pass in JSON {} for search using name: value
    .exec()
    .then(petprofile => { //Pass results of search in res object which gets sent back to browser. 
      //call petprofile(.ejs) view & pass in variable name:value containing data to display
      
        if(req.query.format==="json") //http://localhost:3000/petprofile?format=json
        {
          res.locals.petprofile = petprofile; //adds a new variable to locals which can then be accessed by view. Assign 
          res.json(res.locals.petprofile);
        }
        else //http://localhost:3000/petprofile
        {
          res.render("petprofile", {
            petprofile_variable: petprofile 
          });
        }     
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

module.exports = {

  new: (req, res) => {
    res.render("petprofile/new");
  },

  create: (req, res, next) => {
    let memberObjectId = req.body.memberObjectId;
    //check for req.user - may not depend on it being sent!!!
    //look up user to can extract email and store it. need to revise if needed as org planned
    User.findById(memberObjectId)
    .then(foundUser=>{
          let petProfileParams = {
            petOwnerEmail: foundUser.email,
            petName: req.body.petName,
            petAge: req.body.petAge,
            petBreed: req.body.petBreed,
            petTagNumber:req.body.petTagNumber,
            petWeight:req.body.petWeight
          };
          PetProfile.create(petProfileParams)
            .then(newPetProfile => {
              //https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
             User.findByIdAndUpdate(memberObjectId, {$set:{petProfile:newPetProfile}})
                  .then()
                  { 
                      res.locals.redirect = "/master"; 
                      res.locals.petprofile_variable = newPetProfile; 
                      next();  
                  }   
            }) 
            .catch(error => {
              console.log(`Error: ${error.message}`);
              next(error);
            });
      }); //User.findById then
            
      next();
  },

  show: (req, res, next) => {
    let petProfileId = req.params.id;
    PetProfile.findById(petProfileId)
      .then(foundPetprofile => {
        res.locals.petprofile_variable = foundPetprofile;
        next();
      })
      .catch(error => {
        console.log("Error fetching Pet Profile by id: ${error.message}");
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("petprofile/show");
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },
  /*
  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals
    });
  },
  errorJSON: (error, req, res, next) => {
    let errorObject;
    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      };
    } else {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Unknown Error."
      };
    }
    res.json(errorObject);
  },
  */
 
};


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
