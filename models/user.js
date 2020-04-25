"use strict";

const mongoose = require("mongoose"),
  { Schema } = mongoose,
  // bcrypt = require("bcrypt"),
  passportLocalMongoose = require("passport-local-mongoose"),
  userSchema = new Schema(
    {
      name: {
        first: {
          type: String,
          trim: true
        },
        last: {
          type: String,
          trim: true
        }
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
      },
      petProfile: {
        type: Schema.Types.ObjectId,
        ref: "PetProfile"
      }
    },
    {
      timestamps: true
    }
  );

userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`;
});

/*
userSchema.pre("save", function(next) {
  let user = this;
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({
      email: user.email
    })
      .then(subscriber => {
        user.subscribedAccount = subscriber;
        next();
      })
      .catch(error => {
        console.log(`Error in connecting subscriber:${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});
*/
/* CANT DO COS MANY MANDATORY FIELD REQUIRED FOR PET PROFILE
//Add an empty pet profile when creating a new user
userSchema.pre("save", function(next) {
  let user = this;
  if (user.petProfile === undefined) {
    PetProfile.create({
      petOwnerEmail: user.email 
    })
      .then(() => {
        next();
      })
      .catch(error => {
        console.log(`Error in connecting pet profile:${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});
*/

//use this passportLocalMongoose to register users
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

module.exports = mongoose.model("User", userSchema);