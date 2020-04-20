"use strict";

//get reference to mongoose module and store in varaiable mongoose 
const mongoose = require("mongoose"),
validator = require ("validator"), //validate e-mails, etc. 

Breed = require("./pet_profile");

const MemberProfileSchema = new mongoose.Schema({
  /*memberNumber: {
    type: Number,
    unique: true,
    required: true,
  }, */
  email:{
      type: String,
      index: true,
      required: true,
      lowercase: true,
      trim:true,
      validate(value){
        if(!validator.isEmail(value))
        {
            throw new Error("Invalid email!");
        }
      },  
    unique: true 
  },
    memberName: {
    type: String,
    required: true,
    trim: true //always call string trim
  },
  startDate: {
    type: Date,
    required: true,
    min: Date.now()
  },
  petProfile:{
    type: mongoose.Schema.Types.ObjectId, ref: "PetProfile"
  }
},
{ //timestamp each record when created & updated
  timestamps: true
});

//Add a function getMemberProfileInfo to dump out values  
MemberProfileSchema.methods.getPetProfileInfo = function() {
  return `Member Number: ${this.memberNumber} Member email: ${this.email} Member Name: ${this.memberName} Start Date ${this.startDate}`;
};

module.exports = mongoose.model("MemberProfile", MemberProfileSchema);

