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

// Cliente solicita crédito
router.post('/request',
    validarJWT,
    tieneRole('CLIENT_ROLE'),
    requestCredit);

// Admin: listar solicitudes
router.get('/requests',
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    listCreditRequests);

// Admin: aprobar/rechazar
router.post('/process/:creditId',
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    processCreditRequest);

// Cliente: pagar crédito
router.post('/pay/:creditId',
    validarJWT,
    tieneRole('CLIENT_ROLE'),
    payCredit);

export default router;
