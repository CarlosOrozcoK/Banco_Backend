import { Router } from "express";
import {
    getUsuarios,
    getUsuarioById,
    putUsuario,
    deleteUsuario,
    agregarCuentaFavorito
} from "../users/user.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarAdminRole  } from "../middlewares/validar-roles.js";
 
const router = Router();

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get(
    "/",
    validarJWT,
    validarAdminRole,
    getUsuarios
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 */
router.get(
    "/:id",
    validarJWT,
    validarAdminRole,
    getUsuarioById
);

/**
 * @swagger
 * /users/cuenta-favorito:
 *   patch:
 *     summary: Agregar cuenta favorita a usuario
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuenta favorita agregada
 */
router.patch(
    "/cuenta-favorito",
    validarJWT,
    //tieneRole("USER_ROLE"),
    agregarCuentaFavorito
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar usuario por ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put(
    "/:id",
    validarJWT,
    validarAdminRole,
    putUsuario
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar usuario por ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete(
    "/:id",
    validarJWT,
    validarAdminRole,
    deleteUsuario
);


export default router;