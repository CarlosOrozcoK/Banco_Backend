import { Router } from "express";
import { validateJWT } from "../middlewares/validateJWT.js";
import { createBrand, getBrand ,updateBrand,deleteBrand} from "./brand-controller.js";
import {createBrandValidator} from  "../middlewares/validator.js";
import {validarAdminRole,checkDuplicateBrand} from "../middlewares/validar-roles.js"
const router = Router();

/**
 * @swagger
 * /brand/createBrand:
 *   post:
 *     summary: Crear una nueva marca
 *     tags: [Brand]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Marca creada exitosamente
 */
router.post(
 '/createBrand',
  [validateJWT,
  validarAdminRole,
  createBrandValidator,
  checkDuplicateBrand
  ],
  createBrand
);

/**
 * @swagger
 * /brand/viewBrand:
 *   get:
 *     summary: Obtener todas las marcas
 *     tags: [Brand]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de marcas
 */
router.get(
 '/viewBrand',
  validateJWT,
  getBrand
);

router.put(
 '/updateBrand/:id',
 [ validateJWT,
  validarAdminRole
 ],
  updateBrand
);

router.delete(
 '/deleteBrand/:id',
 [ validateJWT,
  validarAdminRole
 ],
  deleteBrand
);

export default router