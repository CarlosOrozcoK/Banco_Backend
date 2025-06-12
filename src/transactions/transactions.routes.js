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
    makeTransferValidator, 
    makeDepositValidator, 
    updateDepositAmountValidator, 
    getAccountMovementsValidator 
} from '../middlewares/validator.js';

import { 
    validateTransferLimits, 
    validateDepositUpdateTimeLimit, 
    validateDepositRevertTimeLimit 
} from '../middlewares/transactions-limits.js';

import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRole } from '../middlewares/validar-roles.js';

const router = Router();

// CLIENT
router.post('/transfer/:originAccount', 
    validarJWT, 
    tieneRole('CLIENT_ROLE'),
    makeTransferValidator,
    validateTransferLimits, 
    makeTransfer
);

router.get('/my/recent', 
    validarJWT,
    tieneRole('CLIENT_ROLE'),
    getMyRecentMovements

);

// ADMIN
router.post('/deposit', 
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    makeDepositValidator, 
    makeDeposit
);

router.put('/deposit/:transactionId', 
    validarJWT, 
    tieneRole("ADMIN_ROLE"),
    updateDepositAmountValidator, 
    validateDepositUpdateTimeLimit, 
    updateDepositAmount
);

router.post('/revertdeposit/:transactionId',
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    validateDepositRevertTimeLimit, 
    revertDepositAmount
);

router.get('/account/:accountId',
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    getAccountMovements
);

router.get('/top-movements', 
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    getAccountMovementsValidator, 
    getTopMovements
);

export default router;
