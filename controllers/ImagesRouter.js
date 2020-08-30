const express = require('express');
const fs = require('fs');
const path = require('path');
const {urltokenVerification} = require('../middlewares/authenication');
var ImagesRouter = express();


ImagesRouter.get('/img/:tipo/:img',urltokenVerification,(req,res)=>{
    let validTypes = ['productos','usuarios'];
    let tipo = req.params.tipo;
    if (validTypes.indexOf(tipo) < 0) {
        return res.status(400).json({
           ok:false,
           message: 'tipo invalido debe ser de los siguientes' + validTypes.join(', ')
        });
    }
    let img = req.params.img;    
    let pathimg = path.resolve(__dirname,`../uploads/${tipo}/${img}`);
    let pathDefaultImg = path.resolve(__dirname,`../public/assets/no-image.jpg`);
    if(fs.existsSync(pathimg)){
        return res.sendFile(pathimg);
    }else {
        return res.sendFile(pathDefaultImg);
    }    
});

module.exports = {
    ImagesRouter:ImagesRouter
}