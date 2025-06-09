import express from 'express';

import {
  agregarFavorito,
  listarFavoritos,
  eliminarFavorito,
  transferirDesdeFavorito,
  convertirSaldo
} from './favoritos.controller.js';

import { favoritoValidator, conversionValidator } from '../middlewares/validator.js';

const router = express.Router();


router.post('/agregar',
   favoritoValidator,
    agregarFavorito);

router.get('/listar', 
  listarFavoritos);

router.delete('/:id',
   favoritoValidator, 
   eliminarFavorito);

router.post('/transferir/:id', 
  favoritoValidator, 
  transferirDesdeFavorito);

router.get('/convertir', 
  conversionValidator, 
  convertirSaldo);

export default router;
//* Método	URL	Descripción
//POST	/api/favoritos/agregar	Agrega un nuevo favorito
//GET	/api/favoritos/listar	Lista los favoritos del usuario
//DELETE	/api/favoritos/eliminar/:id	Elimina un favorito por su ID
//POST	/api/favoritos/transferir/:id	Transfiere a la cuenta favorita
//GET	/api/favoritos/convertir	Convierte divisas con query params
