const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {UserModel} = require('../models/User');

var LoginController = express();

const route = '/login';

// entra el correo y contraseña por el url encoding

LoginController.post(route,(req,res)=>{
    let body = req.body;
    UserModel.findOne({email: body.email},(err,result)=>{
        if (err){
            return res.status(400).json({
                ok:false,
                error:err
            });
        }
        if(!result){
            return res.status(400).json({
                ok:false,
                error:{
                    error:'usuario no encontrado'
                }
            });
        }
        if (!bcrypt.compareSync(body.password,result.password)){
            return res.status(400).json({
                ok:false,
                error:{
                    error:'credenciales no coinciden'
                }
            });
        }else{
            let token = jwt.sign( {usuario:result} ,process.env.JWT_SIGNATURE,{ expiresIn:process.env.JWT_EXP_TIME});// la expiracion es en segundos por eso es que hay que multiplicar
            return res.status(200).json({
                ok:true,
                resume:result,
                token:token
            });
        }
    }); 
});

module.exports = {
    LoginController
}