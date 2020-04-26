"use strict";

//const MemberProfile = require("../models/member_profile");

exports.getMasterPage = (req, res) => {
  res.render("master");
};

exports.getMasterPageNoPetProfile = (req, res) => {
     //no view/edit menu presented for pet profile as doesn't exist
    res.render("master",{ layout: 'layout_no_pet_profile' });  
};

