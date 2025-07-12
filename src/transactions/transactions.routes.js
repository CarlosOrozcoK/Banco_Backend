import { Router } from 'express';
import {
    makeTransfer,
    makeDeposit,
    updateDepositAmount,
    revertDepositAmount,
    getAccountMovements,
    getTopMovements,
    getMyRecentMovements
} from './transactions.controller.js';


import { 
    validateTransferLimits, 
    validateDepositUpdateTimeLimit, 
    validateDepositRevertTimeLimit 
} from '../middlewares/transactions-limits.js';

import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

/**
 * @swagger
 * /transactions/transfer/{originAccount}:
 *   post:
 *     summary: Realizar transferencia
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: originAccount
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transferencia realizada
 */
router.post('/transfer/:originAccount', 
    validarJWT,
    validateTransferLimits, 
    makeTransfer
);

/**
 * @swagger
 * /transactions/my/recent:
 *   get:
 *     summary: Obtener movimientos recientes del cliente
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Movimientos recientes
 */
router.get('/my/recent', 
    validarJWT,
    getMyRecentMovements
);

/**
 * @swagger
 * /transactions/deposit:
 *   post:
 *     summary: Realizar depósito
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Depósito realizado
 */
router.post('/deposit', 
    validarJWT,
    makeDeposit
);

/**
 * @swagger
 * /transactions/deposit/{transactionId}:
 *   put:
 *     summary: Actualizar monto de depósito
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Depósito actualizado
 */
router.put('/deposit/:transactionId', 
    validarJWT, 
    validateDepositUpdateTimeLimit, 
    updateDepositAmount
);

/**
 * @swagger
 * /transactions/revertdeposit/{transactionId}:
 *   post:
 *     summary: Revertir depósito
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Depósito revertido
 */
router.post('/revertdeposit/:transactionId',
    validarJWT,
    validateDepositRevertTimeLimit, 
    revertDepositAmount
);

/**
 * @swagger
 * /transactions/account/{accountId}:
 *   get:
 *     summary: Obtener movimientos de una cuenta
 *     tags: [Transactions]
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
 *         description: Movimientos de la cuenta
 */
router.get('/account/:accountId',
    validarJWT,
    getAccountMovements
);

/**
 * @swagger
 * /transactions/top-movements:
 *   get:
 *     summary: Obtener movimientos principales
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Movimientos principales
 */
router.get('/top-movements', 
    validarJWT,
    getTopMovements
);

export default router;
