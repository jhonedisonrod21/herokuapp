/*
*      system port
*/
const port = process.env.PORT || 3000;
/*
*      Database params
*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; ///esto define si estamos en desarrollo local o ya en produccion

const mongoUSR = 'coffeadmin';
const mongoPSW = 'djjLEh2RUHKRQv4w';
const mongoDB  = 'cafe'
const mongoURI = '';
if(process.env.NODE_ENV === 'dev'){
    mongoURI = 'mongodb://jhon:jerm1998@127.0.0.1:27017/cafe?connectTimeoutMS=1000&bufferCommands=false'
}else{
    mongoURI = `mongodb+srv://${mongoUSR}:${mongoPSW}@mynodecluster.8hrsl.mongodb.net/${mongoDB}?retryWrites=true&w=majority`; // base de datos en la nube con mongo atlas
}

/*
*      module
*/
module.exports = {
    port:port,
    mongoURI:mongoURI
}