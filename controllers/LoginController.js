const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserModel } = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
var LoginController = express();


// entra el correo y contraseña por el url encoding

LoginController.post('/login', (req, res) => {
    let body = req.body;
    UserModel.findOne({ email: body.email }, (err, result) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        if (!result) {
            return res.status(400).json({
                ok: false,
                error: {
                    error: 'usuario no encontrado'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, result.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    error: 'credenciales no coinciden'
                }
            });
        } else {
            let token = jwt.sign({ usuario: result }, process.env.JWT_SIGNATURE, { expiresIn: process.env.JWT_EXP_TIME });// la expiracion es en segundos por eso es que hay que multiplicar
            return res.status(200).json({
                ok: true,
                resume: result,
                token: token
            });
        }
    });
});

LoginController.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let googeUser = await verify(token).catch((err) => {
        res.status(403).json({
            ok: false,
            err: err
        });
    });
    UserModel.findOne({ email: googeUser.email }, (err, userDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (userDB) {
            if (userDB.google === false) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'debe de iniciar sesion con su cuenta normal'
                    }
                });
            } else {
                let token = jwt.sign({ usuario: userDB }, process.env.JWT_SIGNATURE, { expiresIn: process.env.JWT_EXP_TIME });// la expiracion es en segundos por eso es que hay que multiplicar
                return res.status(200).json({
                    ok: true,
                    resume: userDB,
                    token: token
                });
            }
        } else {
            //si el usuario no existe en nuestra base de datos
            let usuario = new UserModel();
            usuario.name = googeUser.nombre;
            usuario.email = googeUser.email;
            usuario.img = googeUser.img;
            usuario.google = true;
            usuario.password = ':)'
            usuario.save((err, usuarioDB) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        err: err
                    });
                } else {
                    let token = jwt.sign({ usuario: usuarioDB }, process.env.JWT_SIGNATURE, { expiresIn: process.env.JWT_EXP_TIME });// la expiracion es en segundos por eso es que hay que multiplicar
                    return res.status(200).json({
                        ok: true,
                        resume: usuarioDB,
                        token: token
                    });
                }
            });
        }
    });

})

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

module.exports = {
    LoginController
}