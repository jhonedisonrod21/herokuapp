const express = require('express');
const {CategoriaModel} = require('../models/Categoria');
const bcrypt = require('bcrypt');
const {tokenVerification,adminVerification} = require('../middlewares/authenication');
               //defines the default page count for the requests
var CategoriaController = express();

CategoriaController.get('/categoria',tokenVerification,(req,res)=>{ // todas las categorias
    CategoriaModel.find().populate('usuario','name email').exec((err,results)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err:err

            })
        }else if(results){
            return res.status(200).json({
                ok:true,
                results:results
            })
        }else{
            return res.status(400).json({
                ok:true,
                message:'no se encontro ninguna categoria'
            })
        }
    })
});

CategoriaController.get('/categoria/:id',tokenVerification,(req,res)=>{ // una categoria por id
    let id = req.params.id
    CategoriaModel.findOne({_id:id}).exec((err,categoria)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err:err

            });
        }else if(categoria){
            return res.status(200).json({
                ok:true,
                result:categoria
            });
        }else{
            return res.status(400).json({
                ok:false,
                message:'no se encontro ninguna categoria con ese id'
            });
        }
    })
});

CategoriaController.post('/categoria',tokenVerification,(req,res)=>{ // crea una nueva categoria y la retorna
    newCategoria = CategoriaModel();
    newCategoria.usuario = req.user._id;
    newCategoria.descripcion = req.body.descripcion;
    newCategoria.save((err,result)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err:err
            });
        }else if(result){
            return res.status(200).json({
                ok:true,
                result:result
            });
        }else{
            return res.status(400).json({
                ok:false,
                message:'ocurrio un error al intentar crear el usuario'
            });
        }
    });
});

CategoriaController.put('/categoria/:id',tokenVerification,(req,res)=>{ // actualizar una categoria
    let id = req.params.id
    let desc = req.body.descripcion;
    CategoriaModel.findByIdAndUpdate(id,{descripcion:desc},{new:true,runValidators:true,useFindAndModify:false}).exec((err,categoria)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err:err

            });
        }else if(categoria){
            return res.status(200).json({
                ok:true,
                result:categoria
            });
        }else{
            return res.status(400).json({
                ok:false,
                message:'no se encontro ninguna categoria con ese id'
            });
        }
    })
});

CategoriaController.delete('/categoria/:id',[tokenVerification,adminVerification],(req,res)=>{ // eliminar una categoria solo un adminisrador puede borrar categorias 
    let id = req.params.id   
    CategoriaModel.findByIdAndDelete(id).exec((err,categoria)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err:err

            });
        }else if(categoria){
            return res.status(200).json({
                ok:true,
                result:categoria
            });
        }else{
            return res.status(400).json({
                ok:false,
                message:'no se encontro ninguna categoria con ese id'
            });
        }
    });
});

module.exports = {CategoriaController};