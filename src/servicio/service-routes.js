import { Router } from "express";
import { validateJWT } from "../middlewares/validateJWT.js";
import { createService, getService ,updateService,deleteService} from "./service-controller.js";
import {createServiceValidator} from  "../middlewares/validator.js";
import{checkDuplicateService,validarAdminRole} from "../middlewares/validar-roles.js"


const router = Router();

router.post(
 '/createService',
  [validateJWT,
    validarAdminRole,
  createServiceValidator,
  checkDuplicateService
  ],
  createService

);

router.get(
 '/viewService',
  validateJWT,
  getService
);

router.put(
 '/updateService/:id',
 [ validateJWT,
  validarAdminRole
 ],
  updateService
);

router.delete(
 '/deleteService/:id',
  [validateJWT,
  validarAdminRole
  ],
  deleteService
);

export default router