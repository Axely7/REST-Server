const { response, request } = require("express");
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');


const userGet = (req = request, res = response) => {
  const { q, nombre, page = 1 } = req.query;

  res.json({
    msg: "get API - controlador",
    q,
    nombre,
    page,
  });
};

const userPut = (req, res = response) => {
  const id = req.params.id;

  res.json({
    msg: "put API - controlador",
    id,
  });
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

const userDelete = (req, res = response) => {
  res.json({
    msg: "delete API - controlador",
  });
};

module.exports = {
  userGet,
  userPut,
  userPost,
  userDelete,
};
