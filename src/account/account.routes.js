import { Router } from 'express';
import { createAccount, getAccountsByUser, getAccountById, getAccounts } from './account.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

/**
 * @swagger
 * /account/create:
 *   post:
 *     summary: Crear una cuenta
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Cuenta creada
 */
router.post('/create', 
    createAccount
);

/**
 * @swagger
 * /account/user/{userId}:
 *   get:
 *     summary: Obtener cuentas por usuario
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de cuentas del usuario
 */
router.get('/user/:userId',
    [ validarJWT,
    ],getAccountsByUser
);

/**
 * @swagger
 * /account/{accountId}:
 *   get:
 *     summary: Obtener cuenta por ID
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cuenta encontrada
 */
router.get('/:accountId', 
    [validarJWT,
    ],getAccountById
);

/**
 * @swagger
 * /account/:
 *   get:
 *     summary: Obtener todas las cuentas
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cuentas
 */
router.get('/', 
    [validarJWT,
    ],getAccounts
);

export default router;