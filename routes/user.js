const { Router } = require("express");
const { check } = require("express-validator");
const { esRoleValido, emailExiste } = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");


const {
  userGet,
  userPut,
  userPost,
  userDelete,
} = require("../controllers/user");


const router = Router();

router.get("/", userGet);

router.put("/:id", userPut);

router.post("/", [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password debe de ser más de 6 letras').isLength({min: 6}),
  check('correo', 'El correo no es válido').isEmail(),
  check('correo').custom(emailExiste),
  // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('rol').custom(esRoleValido),
  validarCampos
], userPost);

router.delete("/", userDelete);

module.exports = router;
