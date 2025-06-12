import User from "./user.model.js";
import Account from "../account/account.model.js";

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

export const agregarCuentaFavorito = async (req, res) => {
    const { accountId, alias } = req.body;
    const userId = req.usuario?._id || req.userId || req.user?.id;

    try {
        // Verifica que la cuenta exista y esté activa
        const cuenta = await Account.findById(accountId);
        if (!cuenta || !cuenta.status) {
            return res.status(404).json({ msg: "Account not found or inactive" });
        }

        // Busca el usuario
        const usuario = await User.findById(userId);
        if (!usuario) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Evita duplicados
        const yaFavorito = usuario.favoritos.some(
            fav => fav.cuenta.toString() === accountId
        );
        if (yaFavorito) {
            return res.status(400).json({ msg: "Account already in favorites" });
        }

        // Agrega a favoritos
        usuario.favoritos.push({ cuenta: accountId, alias });
        await usuario.save();

        res.status(200).json({ msg: "Account added to favorites", favoritos: usuario.favoritos });
    } catch (error) {
        res.status(500).json({ msg: "Error adding favorite account", error });
    }
};