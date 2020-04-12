"use strict";

const router = require("express").Router(),
  homeController = require("../controllers/homeController");

  //Set public layout navigation for public page with register & login options
router.get("/", (req, res) => {
    res.render('index', { layout: 'layout_public' });
  });

router.get("/", homeController.index);

  //for now - needs to move to better place
  router.get("/master", (req, res) => {
    res.render('master');
  });

module.exports = router;
