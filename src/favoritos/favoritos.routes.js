import express from 'express';
import { validarJWT } from '../middlewares/validar-jwt.js';
import {
  agregarFavorito,
  listarFavoritos,
  eliminarFavorito,
  transferirDesdeFavorito
} from './favoritos.controller.js';

import { favoritoValidator } from '../middlewares/validator.js';

export const transferenciaValidator = (req, res, next) => {
  const { monto } = req.body;
  if (monto === undefined || monto === null || isNaN(monto) || parseFloat(monto) <= 0) {
    return res.status(400).json({ error: 'Monto inválido o faltante para la transferencia' });
  }
  next();
};

const router = express.Router();

router.post('/agregar', validarJWT, favoritoValidator, agregarFavorito);
router.get('/listar', validarJWT, listarFavoritos);
router.delete('/:id', validarJWT, eliminarFavorito);  // Esta línea es clave
router.post('/transferir/:id', validarJWT, transferenciaValidator, transferirDesdeFavorito);

export default router;
