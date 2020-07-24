const jwt = require('jsonwebtoken');

/**
 *  verifies the token to have authorised acces to data
 */
let tokenVerification = (req,res,next)=>{

    let token = req.get('token');
    let signature = process.env.JWT_SIGNATURE;

    jwt.verify(token,signature,(err,decoded)=>{ // decoded es la informacion que contiene el token
        if(err){
            return res.status(401).json({
                ok:false,
                error:{
                    error:'usted no esta autorizado'
                }
            });
        }
        console.log(decoded);
        req.user = decoded.usuario;
        next();        
    });
}

/**
 *  verifies the token to have authorised acces to data
 */
let adminVerification = (req,res,next)=>{
    let user = req.user;
    if(user.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.status(401).json({
            ok:false,
            error:{
                error:'usted no esta autorizado'
            }
        });
    }
}

module.exports = {
    tokenVerification,
    adminVerification
}