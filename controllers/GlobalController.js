const express = require('express');
const bodyParser = require('body-parser');
const {UserController} = require('./UserController');
const {LoginController} = require('./LoginController'); 
const {CategoriaController} = require('./CategoriaController'); 
const {ProductoController} = require('./ProductoController');
const {UploadsManager} = require('./Uploads');
const {ImagesRouter} = require('./ImagesRouter');

var GlobalController = express();

GlobalController.use(bodyParser.urlencoded({ extended: false })); 
GlobalController.use(bodyParser.json());

GlobalController.use(UserController);
GlobalController.use(LoginController);
GlobalController.use(CategoriaController);
GlobalController.use(ProductoController);
GlobalController.use(UploadsManager);
GlobalController.use(ImagesRouter);

module.exports = {
    GlobalController
}