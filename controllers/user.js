const { response, request } = require("express");
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');


const userGet = async(req = request, res = response) => {
  // const { q, nombre, page = 1 } = req.query;

  const {limite = 5, desde = 0} = req.query
  // Unicamente retorna aquellos registros con estado en true.

  const query = { estado: true }


  // Ejecuta las promesas de manera simultanea:

  const [ total, usuarios ] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
    .skip(desde)
    .limit(limite)
  ]);

  res.json({
    total,
    usuarios
  });
};

const userPut = async (req, res = response) => {
  const {id} = req.params;

  const { _id, password, google, correo, ...resto } = req.body;

  // TODO validar contra BD

  if(password){
    const salt = bcryptjs.genSaltSync()
    resto.password = bcryptjs.hashSync(password, salt)
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto)

  res.json(usuario);
};

const userPost = async (req, res = response) => {

  

  const {nombre, correo, password, rol} = req.body;
  // para agarrar las demas propiedades:  const { google, ...resto } = req.body
  const usuario = new Usuario( {nombre, correo, password, rol} );

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync()
  usuario.password = bcryptjs.hashSync(password, salt)


  // Guardad en BD
  await usuario.save()

  res.json({
    msg: "post API - controlador",
    usuario
  });
};

const userDelete = async(req, res = response) => {

  const { id } = req.params; 

  // Fisicamente lo borramos
  // const usuario = await Usuario.findByIdAndDelete(id)
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false })

  res.json(usuario);
};

module.exports = {
  userGet,
  userPut,
  userPost,
  userDelete,
};
