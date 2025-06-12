import { Router } from 'express';
import { createAccount, getAccountsByUser, getAccountById, getAccounts } from './account.controller.js';
import { createAccountValidator, getAccountsByUserValidator, getAccountByIdValidator, getAccountsValidator } from '../middlewares/validator.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRole } from '../middlewares/validar-roles.js';

const router = Router();

router.post('/create', 
    [validarJWT,
    createAccountValidator,
    tieneRole('ADMIN_ROLE')
    ],createAccount
);

router.get('/user/:userId',
    [ validarJWT,
    getAccountsByUserValidator,
    ],getAccountsByUser
);

router.get('/:accountId', 
    [validarJWT,
    getAccountByIdValidator
    ],getAccountById
);

router.get('/', 
    [validarJWT,
    getAccountsValidator,
    tieneRole('ADMIN_ROLE')
    ],getAccounts
);

export default router;