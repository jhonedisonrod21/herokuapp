const express = require('express');
const bodyParser = require('body-parser');
const {UserController} = require('./UserController');
const {LoginController} = require('./LoginController'); 

var GlobalController = express();
GlobalController.use(bodyParser.urlencoded({ extended: false })); 
GlobalController.use(bodyParser.json());


GlobalController.use(UserController);
GlobalController.use(LoginController);

module.exports = {
    GlobalController
}