const { Router } = require("express");
const { check } = require("express-validator");
const { crearProducto, 
    obtenerProductos,
     obtenerProducto, 
    actualizarProducto, 
    borrarProducto } =  require('../controllers/productos')
const { existeCategoriaPorId, existeProductoPorId } = require("../helpers/db-validators");
const { tieneRole } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

// obtener todas las categorias - público
router.get('/', obtenerProductos)

// obtener una categoria por id - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto)

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto)
 

// Actualizar categoria - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('categoria').if((value, {req}) => req.body.categoria).custom(existeCategoriaPorId),
    validarCampos
], actualizarProducto)
 
// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports = router