const express = require('express');
const {UserModel} = require('../models/User');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const {tokenVerification,adminVerification} = require('../middlewares/authenication');
const route = '/users';                     //defines the default route to all methods
const defaultFrom = 0;                      //defines the default start point to paging
const defaultPageCount = 5;                 //defines the default page count for the requests
var UserController = express();

UserController.get(route,tokenVerification,(req,res)=>{
       
    let from = Number(req.query.from) || defaultFrom;
    let itemsPerPage = Number(req.query.itemsPerPage) || defaultPageCount;  
    let condition ={ state:true }

    UserModel.find(condition,'name email role state google img') //aqui se coloca el condicional para la consulta
    .skip(from) 
    .limit(itemsPerPage) 
    .exec((err,array)=>{
        if(err) res.status(400).json({
            ok:false,
            resume:err
        });
        else {
            UserModel.count(condition,(err,counter)=>{ // aqui se colocala misma condicion del 
                res.status(200).json({
                    ok:true,
                    result:array,
                    querryCount:counter       
                });
            });
        }
    });

});

UserController.post(route,[tokenVerification,adminVerification],(req,res)=>{
    var data = req.body;
    var NewUser = UserModel({
        name:data.name,
        email:data.email,
        password:bcrypt.hashSync(data.password,10),
        img:data.img,
        role:data.role,
        state:data.state,
        google:data.google
    });
    NewUser.save((err,result)=>{
        if(err) res.status(400).json({
            ok:false,
            resume:err
        });
        else res.status(200).json({
            ok:true,
            resume:result
        });
    });
});

UserController.put(route + '/:id',[tokenVerification,adminVerification],(req,res)=>{
    let id = req.params.id;
    let data = _.pick(req.body,['name','email','img','role','state']);//seleccionamos los objetos actualizables para evitar modificaciones indeseadas

    UserModel.findByIdAndUpdate(id,data,{new:true,runValidators:true},(err,result)=>{
        if(err) res.status(400).json({
            ok:false,
            resume:err
        });
        else res.status(200).json({
            ok:true,
            resume:result
        });
    });
});

UserController.delete(route + '/:id',[tokenVerification,adminVerification],(req,res)=>{
    UserModel.findByIdAndRemove(req.params.id,{},(err,result)=>{
        if(err){ 
            return res.status(400).json({
                ok:false,
                resume:err
            });
        }
        if(!result){
            return res.status(400).json({
                ok:false,
                resume:{
                    errors:{
                        error:{
                            message:'El usuario no se encontrado en la base de datos'
                        }
                    }
                }
            });
        }else {
            return res.status(200).json({
                ok:true,
                resume:{
                    message:'el usuario fue borrado con exito'
                }
            });
        }
        

    })
});

UserController.delete(route + '_cons/:id',[tokenVerification,adminVerification],(req,res)=>{  // desactiva al usuario en lugar de eliminarlo por completo
    let statusChange ={
        state:false
    }
    UserModel.findByIdAndUpdate(req.params.id,statusChange,(err,result)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err:err
            })
        }
        if(!result || result.state === false){
            return res.status(400).json({
                ok:false,
                resume:{
                    errors:{
                        error:{
                            message:'El usuario no se encontrado en la base de datos'
                        }
                    }
                }
            });
        }else{
            return res.status(200).json({
                ok:true,
                resume:{
                    message:'el usuario fue borrado con exito'
                }
            });
        }
    });
});

module.exports = {
    UserController
}