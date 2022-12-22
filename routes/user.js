const { Router } = require("express");
const { check } = require("express-validator");
const { esRoleValido, emailExiste, existeUsuarioPorId } = require("../helpers/db-validators");
// const { validarCampos } = require("../middlewares/validar-campos");

// const { validarJWT } = require("../middlewares/validar-jwt");
// const { esAdminRole, tieneRole } = require("../middlewares/validar-roles");
const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole
} = require('../middlewares')

const {
  userGet,
  userPut,
  userPost,
  userDelete,
} = require("../controllers/user");


const router = Router();

router.get("/", userGet);

// Todo aquello dentro de corchetes son validaciones: middlewares
router.put("/:id", [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  check('rol').custom(esRoleValido),
  validarCampos
], userPut);

router.post("/", [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password debe de ser más de 6 letras').isLength({min: 6}),
  check('correo', 'El correo no es válido').isEmail(),
  check('correo').custom(emailExiste),
  // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('rol').custom(esRoleValido),
  validarCampos
], userPost);

router.delete("/:id", [
  validarJWT,
  // esAdminRole,
  tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], userDelete);

module.exports = router;
