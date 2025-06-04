import User from '../users/user.model.js';



export const existenteEmail = async (email = ' ') => {
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`Email ${email} exists in the database!`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if (!existeUsuario) {
        throw new Error(`id ${id} dont exists!`);
    }
}
