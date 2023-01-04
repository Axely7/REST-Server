const { request, response } = require("express")
const { Producto } = require("../models")




const crearProducto = async ( req = request, res = response ) => {
    
    // Ignoramos estado y usuario, ya que estos no se tienen que editar
    const { estado, usuario, ...body} = req.body

    const productoDB = await Producto.findOne({ nombre })

    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }

    const producto = new Producto(data);

    await producto.save()

    res.status(201).json(producto)
}


module.exports = {
    crearProducto
}