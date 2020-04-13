"use strict";

//get reference to mongoose module and store in varaiable mongoose 
const mongoose = require("mongoose"),
validator = require ("validator"), //validate e-mails, etc. 

const FoodDiaryEntrySchema = new mongoose.Schema({ 
    //to do - join document to parent account
    foodName: {
    type: String,
    required: true,
    trim: true //always call string trim before storing
  },
  foodQuantity: { //make an enum
    type: String,
    required: true,
    trim: true 
  },
  foodUnits: {
    type: String,
    required: true,
    trim: true 
  },
  foodEntryDate: {
    type: Date,
    required: true
   }
},
{ //timestamp each record when created & updated
  timestamps: true
});

/*
//Add a function getMemberProfileInfo to dump out values  
MemberProfileSchema.methods.getFoodDetails = function() {
  return `Member Number: ${this.memberNumber} Member email: ${this.email} Member Name: ${this.memberName} Start Date ${this.startDate}`;
};
*/
module.exports = mongoose.model("FoodDiaryEntry", FoodDiaryEntrySchema);
