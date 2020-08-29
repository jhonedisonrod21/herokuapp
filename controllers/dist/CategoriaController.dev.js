"use strict";

var express = require('express');

var _require = require('../models/Categoria'),
    CategoriaModel = _require.CategoriaModel;

var bcrypt = require('bcrypt');

var _require2 = require('../middlewares/authenication'),
    tokenVerification = _require2.tokenVerification,
    adminVerification = _require2.adminVerification; //defines the default page count for the requests


var CategoriaController = express();
CategoriaController.get('/categoria', tokenVerification, function (req, res) {
  // todas las categorias
  CategoriaModel.find().populate('usuario', 'name email').exec(function (err, results) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    } else if (results) {
      return res.status(200).json({
        ok: true,
        results: results
      });
    } else {
      return res.status(400).json({
        ok: true,
        message: 'no se encontro ninguna categoria'
      });
    }
  });
});
CategoriaController.get('/categoria/:id', tokenVerification, function (req, res) {
  // una categoria por id
  var id = req.params.id;
  CategoriaModel.findOne({
    _id: id
  }).exec(function (err, categoria) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    } else if (categoria) {
      return res.status(200).json({
        ok: true,
        result: categoria
      });
    } else {
      return res.status(400).json({
        ok: false,
        message: 'no se encontro ninguna categoria con ese id'
      });
    }
  });
});
CategoriaController.post('/categoria', tokenVerification, function (req, res) {
  // crea una nueva categoria y la retorna
  newCategoria = CategoriaModel();
  newCategoria.usuario = req.user._id;
  newCategoria.descripcion = req.body.descripcion;
  newCategoria.save(function (err, result) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    } else if (result) {
      return res.status(200).json({
        ok: true,
        result: result
      });
    } else {
      return res.status(400).json({
        ok: false,
        message: 'ocurrio un error al intentar crear el usuario'
      });
    }
  });
});
CategoriaController.put('/categoria/:id', tokenVerification, function (req, res) {
  // actualizar una categoria
  var id = req.params.id;
  var desc = req.body.descripcion;
  CategoriaModel.findByIdAndUpdate(id, {
    descripcion: desc
  }, {
    "new": true,
    runValidators: true,
    useFindAndModify: false
  }).exec(function (err, categoria) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    } else if (categoria) {
      return res.status(200).json({
        ok: true,
        result: categoria
      });
    } else {
      return res.status(400).json({
        ok: false,
        message: 'no se encontro ninguna categoria con ese id'
      });
    }
  });
});
CategoriaController["delete"]('/categoria/:id', [tokenVerification, adminVerification], function (req, res) {
  // eliminar una categoria solo un adminisrador puede borrar categorias 
  var id = req.params.id;
  CategoriaModel.findByIdAndDelete(id).exec(function (err, categoria) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    } else if (categoria) {
      return res.status(200).json({
        ok: true,
        result: categoria
      });
    } else {
      return res.status(400).json({
        ok: false,
        message: 'no se encontro ninguna categoria con ese id'
      });
    }
  });
});
module.exports = {
  CategoriaController: CategoriaController
};