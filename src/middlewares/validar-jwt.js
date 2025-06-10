import jwt from 'jsonwebtoken';

export const validarJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No hay token en la petición' });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    req.usuario = { _id: payload.uid };
    next();
  } catch (err) {
    console.error('Error al verificar el token:', err);
    return res.status(401).json({ error: 'Token no válido', detalle: err.message });
  }
};
