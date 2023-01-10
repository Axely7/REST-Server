const { response } = require('express');
const { Usuario, Categoria, Producto } = require('../models');
const { ObjectId } = require('mongoose').Types;

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'productos_categoria',
    'roles'
]

const buscarUsuarios = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); 

    if(esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [ usuario ] : []
        })
    }

    const regex = RegExp(termino, 'i');

    const usuarios = await Usuario.find({ 
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{ estado: true }]
     })

    return res.json({
        results: usuarios
    })

}

const buscarCategorias = async(termino = '', res = response) => {
    
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = RegExp(termino, 'i');

    const categorias = await Categoria.find({ nombre: regex, estado: true })

    return res.json({
        results: categorias
    })
}

const buscarProductos = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = RegExp(termino, 'i');

    const productos = await Producto.find({ nombre: regex, estado: true }).populate('categoria', 'nombre');

    return res.json({
        results: productos
    })
}

const searchProductsByCategory = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const producto = await Producto.find({ categoria: ObjectId(termino) }).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = RegExp(termino, 'i');

    const categorias = await Categoria.find({ nombre: regex, estado: true });

    const productos = await Producto.find({
        $or: [...categorias.map(categoria => ({
            categoria: categoria._id
        }))],
        $and: [{ estado: true }]
    }).populate('categoria', 'nombre')

    return res.json({
        results: productos
    })

}



const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;

        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'productos_categoria':
            searchProductsByCategory(termino, res);
            break;
    
        default:
            res.status(500).json({
                msg: 'No está implementada esta busqueda'
            })
    }

}


module.exports = {
    buscar
}