import jwt from 'jsonwebtoken';

export const validarJWT = (req, res, next) => {
  const token = req.header('x-token');
  if (!token) {
    return res.status(401).json({ error: 'Token no enviado' });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    req.usuario = { _id: uid }; 
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
