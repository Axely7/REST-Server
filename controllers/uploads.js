const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models');
const usuario = require("../models/usuario");

const cargarArchivo = async(req, res = response) => {

   
    try {

        // Imagenes
        // const pathCompleto = await subirArchivo(req.files, ['txt', 'md'], 'markdown');
        const pathCompleto = await subirArchivo(req.files, undefined, 'markdown');

        res.json({
            nombre: pathCompleto
        })

    } catch (msg) {
        res.status(400).json({msg})
    }    
}

const actualizarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params;
  
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
        break;
            
    
        default:
            res.status(500).json({msg: 'No existe colección disponible'})
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();


    res.json(modelo)
}


module.exports = {
    cargarArchivo,
    actualizarImagen
}