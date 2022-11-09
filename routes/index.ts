//const express = require('express');
import express from "express";
const router = express.Router();

/* GET home page. */
router.get('./dasboard.html', function(req, res,) {
  res.render('index',  { title: 'My Book Library' });
});

module.exports = router;
