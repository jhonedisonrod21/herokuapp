var express = require('express');
const fileUpload = require('express-fileupload');
const {tokenVerification} = require('../middlewares/authenication');
const { request } = require('express');
const {UserModel} = require('../models/User');
const {ProductoModel} = require('../models/Producto');
const fs = require('fs');
const path = require('path');
var app = express();
app.use( fileUpload({ useTempFiles: true }) );


app.put('/upload/:tipo/:id',tokenVerification,(req,res)=>{
    let tipo = req.params.tipo;
    let id = req.params.id;
    let validtypes = ['productos','usuarios'];
    if(validtypes.indexOf(tipo) < 0) {// el archivo no es valido para guardarse
        return res.status(400).json({
            ok:false,
            message:'los tipos permitidos son' + validtypes.join(', ')
        });
    }
    if(!req.files) return res.status(400).json({
            ok:false,
            message:'no se envio ningun archivo'
    });

    let archivo = req.files.archivo;
    // extensiones validas
    let validExt = ['jpg','png','gif','jpeg'];
    let name = archivo.name.split('.');
    let exten = name[name.length-1];

    if(validExt.indexOf(exten) < 0) {// el archivo no es valido para guardarse
        return res.status(400).json({
            ok:false,
            message:'las extensiones validas son ' + validExt.join(', ')
        });
    }
    let newname = `${id}-${new Date().getMilliseconds()}.${exten}`
    archivo.name = newname;
    archivo.mv('./uploads/'+tipo+'/'+archivo.name,(err)=>{
        if (err) return res.status(500).json(
            {
                ok:false,
                err:err
            }
        );
        else {
            // en este punto la imagen ya se subio
            switch (tipo) {
                case 'productos':
                    imagenProducto(id,res,newname);
                    break;            
                case 'usuarios':
                    imagenUsuario(id,res,newname);
                    break;
            } 
        }
    });    
});

function imagenUsuario(id,res,nombreArchivo){
    UserModel.findById(id,(err,result)=>{
        if(err) {
            removeImage(nombreArchivo,'usuarios');
            return res.status(500).json(
                {
                    ok:false,
                    err:err
                }
            );
        }
        if(!result){
            removeImage(nombreArchivo,'usuarios')
            return res.status(400).json(
                {
                    ok:false,
                    message:'no se encontro ningun usuario'
                }
            )
        }       
        removeImage(result.img,'usuarios');
        result.img = nombreArchivo;
        result.save((err,updatedUser)=>{
            if (err){
                return res.status(500).json(
                    {
                        ok:false,
                        err:err
                    }
                )
            }
            return res.status(200).json(
                {
                    ok:true,
                    user:updatedUser
                }
            )
        })

    });
}

function imagenProducto(id,res,nombreArchivo){
    ProductoModel.findById(id,(err,result)=>{
        if(err) {
            removeImage(nombreArchivo,'productos');
            return res.status(500).json(
                {
                    ok:false,
                    err:err
                }
            );
        }
        if(!result){
            removeImage(nombreArchivo,'productos')
            return res.status(404).json(
                {
                    ok:false,
                    message:'no se encontro ningun producto'
                }
            )
        }       
        removeImage(result.img,'productos');
        result.img = nombreArchivo;
        result.save((err,updatedProd)=>{
            if (err){
                return res.status(500).json(
                    {
                        ok:false,
                        err:err
                    }
                )
            }
            return res.status(200).json(
                {
                    ok:true,
                    user:updatedProd
                }
            )
        })

    });
}

function removeImage(imgname,type){
    let imgpath = path.resolve(__dirname,`../uploads/${type}/${imgname}`);
    if(fs.existsSync(imgpath)){
        fs.unlinkSync(imgpath);
        return true;
    } 
    return false;
}

module.exports = {
    UploadsManager: app
}
