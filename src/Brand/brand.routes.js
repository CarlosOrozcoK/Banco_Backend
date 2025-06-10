import { Router } from "express";
import { validateJWT } from "../middlewares/validar-jwt.js";
import { createBrand, getBrand ,updateBrand,deleteBrand} from "./brand.controller.js";
import {createBrandValidator} from  "../middlewares/validator.js";
import {validarAdminRole,checkDuplicateBrand} from "../middlewares/validar-roles.js"
const router = Router();

router.post(
 '/createBrand',
  [validateJWT,
  validarAdminRole,
  createBrandValidator,
  checkDuplicateBrand
  ],
  createBrand
);

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