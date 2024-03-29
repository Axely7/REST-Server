const { response, request } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models');
const {uploadFile} = require('../s3')
const path = require('path');
const fs = require('fs')
const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL);



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

    // limpiar imágenes previas
    if(modelo.img){
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen)
        }
    }



    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();


    res.json(modelo)
}


const actualizarImagenAWS = async(req = request, res = response) => {

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

    // limpiar imágenes previas
    if(modelo.img){
       const nombreArr = modelo.img.split("/");
       const nombre = nombreArr[nombreArr.length - 1]
       const [public_id] = nombre.split('.')
       cloudinary.uploader.destroy(public_id)
       
    }

    const imageUrl = await uploadFile(req.files.archivo, coleccion)
    modelo.img = imageUrl;
    await modelo.save();

    // const {tempFilePath} = req.files.archivo

    // const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

    // modelo.img = secure_url;

    // await modelo.save();


    res.json(modelo)
}



const mostrarImagen = async(req = request, res = response) => {

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

    // limpiar imágenes previas
    if(modelo.img){
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen)
        }
    }

    const pathDefaultImage = path.join(__dirname, '../assets', 'no-image.jpg')
    res.sendFile(pathDefaultImage);

}




module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenAWS
}