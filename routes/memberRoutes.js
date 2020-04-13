"use strict";

const router = require("express").Router(),
  memberController = require("../controllers/memberController");

    //All routes below are **relative** to path in index.js 
//Set use of public layout page for registration 
router.get("/", (req, res) => {
    res.render('memberprofile', { layout: 'layout_public' });
  });

  //get the memberprofile page (registration form)
router.get("/", memberController.getMemberProfilePage);

//save logic for registration data to MongoDB
router.post("/", memberController.saveMemberProfile);

module.exports = router;