const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const validRoles = {
    values:['USER_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}


var UserSchemma = new Schema({
    name:{
        type:String,
        required:[true,'El nombre es Obligatorio']
    },
    email:{
        type:String,
        required:[true,'El correo es Obligatorio'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'La contraseña es obligatoria']
    },
    img:{
        type:String,
        required:false
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum:validRoles
    },
    state:{
        type:Boolean,
        default:true
    },
    google:{
        type:String,
        require:false
    }
});

UserSchemma.methods.toJSON = function(){ //permite modificar el objeto que se envia como respuesta
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

UserSchemma.plugin(uniqueValidator,{ message: 'El dato {PATH} ya esta registrado en el sistema'});

module.exports = {
    UserModel: mongoose.model('Usuario',UserSchemma)
}