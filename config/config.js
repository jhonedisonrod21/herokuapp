/*
*      system port
*/
const port = process.env.PORT || 3000;
/*
*      Database params
*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; ///esto define si estamos en desarrollo local o ya en produccion

var mongoURI = '';
if(process.env.NODE_ENV === 'dev'){
    mongoURI = 'mongodb://jhon:jerm1998@127.0.0.1:27017/cafe?connectTimeoutMS=1000&bufferCommands=false'
}else{
    mongoURI = process.env.MONGO_URI; // base de datos en la nube con mongo atlas
}

/*
*   login JWT token params   
*   signature
*   expiration time
*/
process.env.JWT_SIGNATURE = process.env.JWT_SIGNATURE || 'developmenttokensignaure';//gXV9ZrKrHdZu3jAcWRKag6hzX
process.env.JWT_EXP_TIME = process.env.JWT_EXP_TIME || '48h';


/*
*   google client id:
*
*/
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "219589353212-6ms86kbrue22hlr4uqesf2h9tk8h3mtt.apps.googleusercontent.com";

/*
*      module
*/
module.exports = {
    port:port,
    mongoURI:mongoURI
}