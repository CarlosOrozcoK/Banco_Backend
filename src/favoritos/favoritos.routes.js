import express from 'express';
import {
  agregarFavorito,
  listarFavoritos,
  eliminarFavorito,
  transferirDesdeFavorito,
  convertirSaldo
} from './favoritos.controller.js';

import { favoritoValidator, conversionValidator } from '../middlewares/validator.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = express.Router();

router.use(validarJWT); // si estás usando auth

router.post('/agregar', favoritoValidator, agregarFavorito);
router.get('/listar', listarFavoritos);
router.delete('/:id', favoritoValidator, eliminarFavorito);
router.post('/transferir/:id', favoritoValidator, transferirDesdeFavorito);
router.get('/convertir', conversionValidator, convertirSaldo);

export default router;
