"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const express = require('express');
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/* GET home page. */
router.get('./dasboard.html', function (req, res) {
    res.render('index', { title: 'My Book Library' });
});
module.exports = router;
