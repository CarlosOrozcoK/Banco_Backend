// /favoritos/favoritos.model.js

import { Schema, model } from 'mongoose';

const FavoritoSchema = new Schema(
  {
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es requerido!'],
    },
    alias: {
      type: String,
      required: [true, 'El alias es requerido!'],
      trim: true,
      maxLength: [50, 'El alias no puede tener más de 50 caracteres!'],
    },
    cuentaDestino: {
      type: String,
      required: [true, 'El número de cuenta destino es requerido!'],
      unique: false,
      trim: true,
    },
    tipo: {
      type: String,
      enum: ['propia', 'tercero'],
      required: [true, 'El tipo de cuenta es requerido!'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// (Opcional) Si quisieras normalizar la salida JSON:
FavoritoSchema.methods.toJSON = function () {
  const { __v, _id, ...favorito } = this.toObject();
  favorito.id = _id;
  return favorito;
};

export default model('Favorito', FavoritoSchema);
