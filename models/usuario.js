
const {Schema, model} = require('mongoose')

const UsuarioSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});


// excluimos al retorno del JSON al password y al __v
UsuarioSchema.methods.toJSON = function(){
    const {__v, password, ...usuario} = this.toObject()
    return usuario
}


module.exports = model('Usuario', UsuarioSchema)