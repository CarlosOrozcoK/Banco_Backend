// favoritos.controller.js
import Favorito from './favoritos.model.js';
import * as divisasService from './divisas.service.js';

// Agregar favorito
export const agregarFavorito = async (req, res) => {
  try {
    const { alias, cuentaDestino, tipo } = req.body;
    const usuarioId = req.usuario._id;

    if (!['propia', 'tercero'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de cuenta inválido' });
    }

    const nuevoFavorito = new Favorito({ usuarioId, alias, cuentaDestino, tipo });
    await nuevoFavorito.save();

    res.status(201).json(nuevoFavorito);
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar el favorito' });
  }
};

// Listar favoritos
export const listarFavoritos = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;
    const favoritos = await Favorito.find({ usuarioId });
    res.json(favoritos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los favoritos' });
  }
};

// Eliminar favorito
export const eliminarFavorito = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario._id;

    const favorito = await Favorito.findOneAndDelete({ _id: id, usuarioId });
    if (!favorito) {
      return res.status(404).json({ error: 'Favorito no encontrado' });
    }

    res.json({ mensaje: 'Favorito eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el favorito' });
  }
};

// Transferencia desde favorito
export const transferirDesdeFavorito = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto } = req.body;
    const usuarioId = req.usuario._id;

    const favorito = await Favorito.findOne({ _id: id, usuarioId });
    if (!favorito) {
      return res.status(404).json({ error: 'Favorito no encontrado' });
    }

    res.json({
      mensaje: `Transferencia de $${monto} a la cuenta ${favorito.cuentaDestino} realizada exitosamente.`,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al realizar la transferencia' });
  }
};

// Conversión de divisas
export const convertirSaldo = async (req, res) => {
  try {
    const { cantidad, de, a } = req.query;

    if (!cantidad || !de || !a) {
      return res.status(400).json({ error: 'Parámetros requeridos: cantidad, de, a' });
    }

    const resultado = await divisasService.convertirDivisa({
      cantidad: parseFloat(cantidad),
      de,
      a,
    });

    res.json({ resultado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
