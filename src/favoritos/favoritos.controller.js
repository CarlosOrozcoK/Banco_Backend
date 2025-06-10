import mongoose from 'mongoose';
import Favorito from './favoritos.model.js';

// Agregar favorito
export const agregarFavorito = async (req, res) => {
  try {
    if (!req.usuario || !req.usuario._id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    
    const { alias, cuentaDestino, tipo } = req.body;

    if (!alias || !cuentaDestino || !tipo) {
      return res.status(400).json({ error: 'Faltan campos requeridos: alias, cuentaDestino, tipo' });
    }

    if (!['propia', 'tercero'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de cuenta inválido' });
    }

    const usuarioId = req.usuario._id;

    const nuevoFavorito = new Favorito({ usuarioId, alias, cuentaDestino, tipo });
    await nuevoFavorito.save();

    res.status(201).json(nuevoFavorito);
  } catch (err) {
    console.error('Error al agregar el favorito:', err);
    res.status(500).json({ error: 'Error al agregar el favorito', detalle: err.message });
  }
};

// Listar favoritos
export const listarFavoritos = async (req, res) => {
  try {
    if (!req.usuario || !req.usuario._id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const usuarioId = req.usuario._id;
    const favoritos = await Favorito.find({ usuarioId });

    if (!favoritos || favoritos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron favoritos' });
    }

    res.json(favoritos);
  } catch (err) {
    console.error('Error al obtener los favoritos:', err);
    res.status(500).json({ error: 'Error al obtener los favoritos', detalle: err.message });
  }
};

// Eliminar favorito
export const eliminarFavorito = async (req, res) => {
  try {
    if (!req.usuario || !req.usuario._id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID no válido' });
    }

    const usuarioId = req.usuario._id;

    const eliminado = await Favorito.findOneAndDelete({ _id: id, usuarioId });

    if (!eliminado) {
      return res.status(404).json({ error: 'Favorito no encontrado o no autorizado' });
    }

    res.json({ mensaje: 'Favorito eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar el favorito:', err);
    res.status(500).json({ error: 'Error al eliminar el favorito', detalle: err.message });
  }
};


// Transferencia desde favorito
export const transferirDesdeFavorito = async (req, res) => {
  try {
    if (!req.usuario || !req.usuario._id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const { id } = req.params;
    const { monto } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de favorito no válido' });
    }

    if (monto === undefined || monto === null || isNaN(monto) || parseFloat(monto) <= 0) {
      return res.status(400).json({ error: 'Monto inválido' });
    }

    const usuarioId = req.usuario._id;

    const favorito = await Favorito.findOne({ _id: id, usuarioId });

    if (!favorito) {
      return res.status(404).json({ error: 'Favorito no encontrado' });
    }

    return res.json({
      mensaje: `Transferencia de Q${parseFloat(monto).toFixed(2)} a la cuenta ${favorito.cuentaDestino} realizada exitosamente.`,
    });
  } catch (err) {
    console.error('Error al realizar la transferencia:', err);
    return res.status(500).json({ error: 'Error al realizar la transferencia', detalle: err.message });
  }
};