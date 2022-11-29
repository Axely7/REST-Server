const { response, request } = require("express");
const Usuario = require('../models/usuario')


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
  const body = req.body;
  const usuario = new Usuario(body);

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
