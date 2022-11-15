const { response, request } = require("express");

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

const userPost = (req, res = response) => {
  const { nombre, edad } = req.body;

  res.json({
    msg: "post API - controlador",
    nombre,
    edad,
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
