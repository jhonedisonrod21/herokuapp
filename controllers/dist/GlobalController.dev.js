"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var _require = require('./UserController'),
    UserController = _require.UserController;

var _require2 = require('./LoginController'),
    LoginController = _require2.LoginController;

var _require3 = require('./CategoriaController'),
    CategoriaController = _require3.CategoriaController;

var _require4 = require('./ProductoController'),
    ProductoController = _require4.ProductoController;

var GlobalController = express();
GlobalController.use(bodyParser.urlencoded({
  extended: false
}));
GlobalController.use(bodyParser.json());
GlobalController.use(UserController);
GlobalController.use(LoginController);
GlobalController.use(CategoriaController);
GlobalController.use(ProductoController);
module.exports = {
  GlobalController: GlobalController
};