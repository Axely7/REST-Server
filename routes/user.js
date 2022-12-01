const { Router } = require("express");
const { check } = require("express-validator");
const {
  userGet,
  userPut,
  userPost,
  userDelete,
} = require("../controllers/user");

const router = Router();

router.get("/", userGet);

router.put("/:id", userPut);

router.post("/", [check('correo', 'El correo no es válido').isEmail(),], userPost);

router.delete("/", userDelete);

module.exports = router;
