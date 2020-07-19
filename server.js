const express = require('express');
const mongoose = require('mongoose');
const {port,mongoURI} = require('./config/config');                          
const {GlobalController} = require('./controllers/GlobalController')
var app = express();
app.use(GlobalController);

mongoose.connect(mongoURI,{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true},(err)=>{
    if (err) throw err;
    else console.log('Conected to the Mongo DB');
})
app.listen(port,()=>{
    console.log(`Your express service is running in port ${port}`);
});
