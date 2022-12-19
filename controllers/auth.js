const { response } = require("express");
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correcto - correo'
            })
        }

        // verificar si el usuario está activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correcto - estado: false'
            })
        }

        // verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correcto - password'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id)


        res.json({
            msg: 'Login ok',
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
    
}


module.exports = {
    login
}