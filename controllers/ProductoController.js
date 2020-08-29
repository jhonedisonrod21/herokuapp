const express = require('express');
const {ProductoModel} = require('../models/Producto');
const bcrypt = require('bcrypt');
const {tokenVerification} = require('../middlewares/authenication');
const { request } = require('express');
var ProductoController = express();

// obtener todos los  productos usando el populate del usuario y la categoria
ProductoController.get('/productos',tokenVerification,(req,res)=>{ //con el sort junto al find se puede organizar las mondas
    let desde = Number(req.query.desde) || 0;    
    ProductoModel.find({disponible:true})
    .populate('usuario','name email')
    .skip(desde)
    .limit(10)
    .populate('categoria','descripcion')
    .exec((err,results)=>{    
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
                message:'no se encontro ningun producto'
            })
        }
    });
});
// obtener todos los  productos usando el populate del usuario y la categoria con un parametro de busqueda
ProductoController.get('/productos/buscar/:termino',tokenVerification,(req,res)=>{
    let termino = req.params.termino;
    let regex = new RegExp(termino,'i')
    ProductoModel.find({nombre:regex})
    .populate('usuario','name email')
    .populate('categoria','descripcion')
    .exec((err,results)=>{
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
                message:'no se encontro ningun producto'
            })
        }
    })
});

// obtener un producto por id usando el populate del usuario y la categoria
ProductoController.get('/productos/:id',tokenVerification,(req,res)=>{
    ProductoModel.findOne({_id:req.params.id,disponible:true}).populate('usuario','name email').populate('categoria','descripcion').exec((err,result)=>{    
        if (err) {
            return res.status(500).json({
                ok:false,
                err:err
            })
        }else if(result){
            return res.status(200).json({
                ok:true,
                result:result
            })
        }else{
            return res.status(400).json({
                ok:true,
                message:'no se encontro ningun producto'
            })
        }
    });
});

// guardar un usuario junto con la id del usuario que lo creo y la id de una de las categorias de la base de datos
ProductoController.post('/productos',tokenVerification,(req,res)=>{
    NewProduct = ProductoModel();
    NewProduct.nombre = req.body.nombre;
    NewProduct.precioUni = req.body.precioUni;
    NewProduct.descripcion = req.body.descripcion;
    NewProduct.categoria = req.body.categoria;
    NewProduct.usuario = req.user._id;
    NewProduct.save((err,result)=>{
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
                message:'ocurrio un error al intentar crear el producto'
            });
        }
    })
});

// reemplazar o actualizar un producto
ProductoController.put('/productos/:id',tokenVerification,(req,res)=>{
    let nombre = req.body.nombre;
    let precioUni = req.body.precioUni;
    let descripcion = req.body.descripcion;
    let categoria = req.body.categoria;
    let disponible = req.body.disponible;
  ProductoModel.findOneAndUpdate({_id:req.params.id},{nombre:nombre,precioUni:precioUni,descripcion:descripcion,categoria:categoria,disponible:disponible},{new:true,runValidators:true,useFindAndModify:false}).exec((err,result)=>{
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
            message:`no se encontro ningun producto on el id ${req.params.id}`
        });
    }
  }); 
});

// eliminar es cambiar el disponible
ProductoController.delete('/productos/:id',tokenVerification,(req,res)=>{
    ProductoModel.findOneAndUpdate({_id:req.params.id,disponible:true},{disponible:false},{new:true,runValidators:true,useFindAndModify:false}).exec((err,result)=>{
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
                message:`no se encontro ningun producto on el id ${req.params.id}`
            });
        }
      }); 
});

module.exports = {ProductoController};