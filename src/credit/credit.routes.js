import { Router } from 'express';
import {
    requestCredit,
    listCreditRequests,
    processCreditRequest,
    payCredit
} from './credit.controller.js';


import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRole } from '../middlewares/validar-roles.js';

const router = Router();

/**
 * @swagger
 * /credit/request:
 *   post:
 *     summary: Solicitar crédito
 *     tags: [Credit]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Solicitud de crédito creada
 */
router.post('/request',
    validarJWT,
   tieneRole('CLIENT_ROLE'),
    requestCredit);

/**
 * @swagger
 * /credit/requests:
 *   get:
 *     summary: Listar solicitudes de crédito
 *     tags: [Credit]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes de crédito
 */
router.get('/requests',
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    listCreditRequests);

/**
 * @swagger
 * /credit/process/{creditId}:
 *   post:
 *     summary: Procesar solicitud de crédito (aprobar/rechazar)
 *     tags: [Credit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: creditId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Solicitud procesada
 */
router.post('/process/:creditId',
    validarJWT,
   tieneRole('ADMIN_ROLE'),
    processCreditRequest);

/**
 * @swagger
 * /credit/pay/{creditId}:
 *   post:
 *     summary: Pagar crédito
 *     tags: [Credit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: creditId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Crédito pagado
 */
router.post('/pay/:creditId',
    validarJWT,
    tieneRole('CLIENT_ROLE'),
    payCredit);

export default router;
