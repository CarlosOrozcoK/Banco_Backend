import { Router } from "express";
import { check } from "express-validator";
import { validateJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { createProduct, getProduct ,updateProduct,deleteProduct} from "./product.controller.js";
import {createProductValidator} from  "../middlewares/validator.js";
import {checkDuplicateProduct,validarAdminRole} from "../middlewares/validar-roles.js"


const router = Router();

router.post(
 '/createProduct',
  [validateJWT,
   createProductValidator ,
   checkDuplicateProduct,
   validarAdminRole

  ],
  createProduct
);

router.get(
 '/viewProduct',
  validateJWT,
  getProduct
);

router.put(
 '/updateProduct/:id',
  [validateJWT,
  validarAdminRole
],
  updateProduct
);

router.delete(
 '/deleteProduct/:id',
   [
        validateJWT,
        check("password", "La contraseña es obligatoria").not().isEmpty(),
        validarCampos,
        validarAdminRole
    ],
  deleteProduct
);

export default router