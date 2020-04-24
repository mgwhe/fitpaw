"use strict";

const PetProfile = require("../models/pet_profile");

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
    let petProfileParams = {
      petOwnerEmail: req.body.petOwnerEmail,
      petName: req.body.petName,
      petAge: req.body.petAge,
      petBreed: req.body.petBreed,
      petTagNumber:req.body.petTagNumber,
      petWeight:req.body.petWeight
    };
    PetProfile.create(petProfileParams)
      .then(petprofile => {
        res.locals.redirect = ""; //redirect to view of profile
        res.locals.petProfile = petProfile;
        next();
      })
      .catch(error => {
        console.log(`Error saving pet profile: ${error.message}`);
        next(error);
      });
  },

  show: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("courses/show");
  },

  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.render("courses/edit", {
          course: course
        });
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let courseId = req.params.id,
      courseParams = {
        title: req.body.title,
        description: req.body.description,
        items: [req.body.items.split(",")],
        zipCode: req.body.zipCode
      };

    Course.findByIdAndUpdate(courseId, {
      $set: courseParams
    })
      .then(course => {
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error updating course by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId)
      .then(() => {
        res.locals.redirect = "/courses";
        next();
      })
      .catch(error => {
        console.log(`Error deleting course by ID: ${error.message}`);
        next();
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },
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
  join: (req, res, next) => {
    let courseId = req.params.id,
      currentUser = req.user;
    if (currentUser) {
      User.findByIdAndUpdate(currentUser, {
        $addToSet: {
          courses: courseId
        }
      })
        .then(() => {
          res.locals.success = true;
          next();
        })
        .catch(error => {
          next(error);
        });
    } else {
      next(new Error("User must log in."));
    }
  },
  filterUserCourses: (req, res, next) => {
    let currentUser = res.locals.currentUser;
    if (currentUser) {
      let mappedCourses = res.locals.courses.map(course => {
        let userJoined = currentUser.courses.some(userCourse => {
          return userCourse.equals(course._id);
        });
        return Object.assign(course.toObject(), { joined: userJoined });
      });
      res.locals.courses = mappedCourses;
      next();
    } else {
      next();
    }
  }
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
