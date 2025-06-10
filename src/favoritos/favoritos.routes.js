import express from 'express';
import { validarJWT } from '../middlewares/validar-jwt.js';


import {
  agregarFavorito,
  listarFavoritos,
  eliminarFavorito,
  transferirDesdeFavorito
} from './favoritos.controller.js';

import { favoritoValidator, conversionValidator } from '../middlewares/validator.js';

const router = express.Router();


router.post('/agregar', validarJWT, favoritoValidator, agregarFavorito);

router.get('/listar', validarJWT, listarFavoritos);
router.delete('/:id',validarJWT, favoritoValidator, eliminarFavorito);

router.post('/transferir/:id',validarJWT , favoritoValidator, transferirDesdeFavorito);


export default router;


