import { Router } from "express";
import { validateJWT } from "../middlewares/validateJWT.js";
import { createService, getService ,updateService,deleteService} from "./service-controller.js";
import {createServiceValidator} from  "../middlewares/validator.js";
import{checkDuplicateService,validarAdminRole} from "../middlewares/validar-roles.js"


const router = Router();

/**
 * @swagger
 * /service/createService:
 *   post:
 *     summary: Crear un nuevo servicio
 *     tags: [Service]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 */
router.post(
 '/createService',
  [validateJWT,
  createServiceValidator,
  ],
  createService
);

/**
 * @swagger
 * /service/viewService:
 *   get:
 *     summary: Obtener todos los servicios
 *     tags: [Service]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de servicios
 */
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