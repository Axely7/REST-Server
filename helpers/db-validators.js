const Role = require('../models/role')
const Usuario = require('../models/usuario');


const esRoleValido = async(rol='') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
      throw new Error(`El rol ${rol} no está registrado en la BD`)
    }
  }

const emailExiste = async (correo) => {
  const existeEmail = await Usuario.findOne({ correo })
  if(existeEmail){
    // return res.status(400).json({
    //   msg: 'Ese correo ya está registrado'
    // })
    throw new Error('Ese correo ya está registrado')
  }
}


  module.exports = {
    esRoleValido,
    emailExiste
  }
