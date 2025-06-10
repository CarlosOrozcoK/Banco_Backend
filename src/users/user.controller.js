import User from "./user.model.js";

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find({ estado: true });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener usuarios", error });
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await User.findById(id);
    if (!usuario || !usuario.estado) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener usuario", error });
  }
};

// Editar usuario
export const putUsuario = async (req, res) => {
  const { id } = req.params;
  const { password, email, role, ...resto } = req.body;

  try {
    const usuario = await User.findByIdAndUpdate(id, resto, { new: true });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar usuario", error });
  }
};

export const deleteUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await User.findByIdAndUpdate(id, { estado: false }, { new: true });
    res.json({ msg: "Usuario eliminado", usuario });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar usuario", error });
  }
};