import { Router } from "express";
import { check } from "express-validator";
import { validateJWT } from "../middlewares/validateJWT.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { createProduct, getProduct ,updateProduct,deleteProduct} from "./product-controller.js";
import {createProductValidator} from  "../middlewares/validator.js";
import {checkDuplicateProduct,validarAdminRole} from "../middlewares/validar-roles.js"


const router = Router();

/**
 * @swagger
 * /product/createProduct:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 */
router.post(
 '/createProduct',
  [validateJWT,
   createProductValidator ,
   checkDuplicateProduct,
   validarAdminRole

  ],
  createProduct
);

/**
 * @swagger
 * /product/viewProduct:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 */
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