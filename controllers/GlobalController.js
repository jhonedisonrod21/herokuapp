const express = require('express');
const bodyParser = require('body-parser')
const {UserController} = require('./UserController')

var GlobalController = express();
GlobalController.use(bodyParser.urlencoded({ extended: false })); 
GlobalController.use(bodyParser.json());


GlobalController.use(UserController);

module.exports = {
    GlobalController
}