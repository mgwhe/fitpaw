"use strict";

const User = require("../models/user"),
  passport = require("passport"),
  getUserParams = body => {
    return {
      name: {
        first: body.first,
        last: body.last
      },
      email: body.email,
      password: body.password
    };
  };

module.exports = {
  index: (req, res, next) => {
    User.find()
      .then(user => {
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
      res.render("user/index"); 
  },
  new: (req, res) => {
    res.render("user/new",{ layout: 'layout_public' });
  },
  create: (req, res, next) => {
    if (req.skip) next();
    let newUser = new User(getUserParams(req.body));
    
    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        //may make this a popup
        req.flash("success", "${user.fullName}'s account created successfully! Please login");
        res.locals.redirect = "/";
        next();
      } else {
        req.flash("error", "Failed to create user account because: ${error.message}.");
        res.locals.redirect = "/user/new";
        next();
      }
      
    });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("user/show");
  },
  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.render("user/edit", {
          user: user
        });
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let userId = req.params.id,
      userParams = {
        name: {
          first: req.body.first,
          last: req.body.last
        },
        email: req.body.email,
        password: req.body.password,
        zipCode: req.body.zipCode
      };
    User.findByIdAndUpdate(userId, {
      $set: userParams
    })
      .then(user => {
        res.locals.redirect = "/user/${userId}";
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log("Error updating user by ID: ${error.message}");
        next(error);
      });
  },
  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then(() => {
        res.locals.redirect = "/user";
        next();
      })
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },
  login: (req, res) => {
    res.render("user/login",{ layout: 'layout_public' });
  },
  
  authenticate: passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: "Failed to login.",
    //successRedirect: "/food/2020-05-01",
    successRedirect: "/track/add",
    successFlash: "You are now logged in!"
  }),

  validate: (req, res, next) => {
    req
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true
      })
      .trim();
    req.check("email", "Email is invalid").isEmail();
    req.check("password", "Password cannot be empty").notEmpty();

    req.getValidationResult().then(error => {
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/user/new";
        next();
      } else {
        next();
      }
    });
  },
  logout: (req, res, next) => {
    req.logout();
    req.flash("success", "You have been logged out!");
    res.locals.redirect = "/";
    next();
  },
  /*
  authenticateWithAPI: passport.authenticate("local", {
    failureRedirect: "/user/login",
    successRedirect: "/master"
  }) */
  
  //remove session false but does can there be a session if in a modal????
  authenticateWithAPI: passport.authenticate('local', { session: false },
  //see http://www.passportjs.org/docs/basic-digest/ change to match model
  function(req, res) {
    res.json(
      {
        data: req.user //added assignment to a varaible data so can be tested
      });
      
      //res.send("<script>window.close()</script>"); //close the dialog! 
      }
    )};