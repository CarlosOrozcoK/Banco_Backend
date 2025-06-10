import { Router } from "express";
import {
  getUsuarios,
  getUsuarioById,
  putUsuario,
  deleteUsuario,
} from "../users/user.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole  } from "../middlewares/validar-roles.js";
 
const router = Router();



router.get(
    "/",
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    getUsuarios
);

router.get(
    "/:id",
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    getUsuarioById
);

router.put(
    "/:id",
    validarJWT,
    tieneRole("ADMIN_ROLE",),
    putUsuario
);
router.delete(
    "/:id",
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    deleteUsuario
);

export default router;