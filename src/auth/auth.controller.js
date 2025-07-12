import mongoose from 'mongoose';
import { hash as hashPassword, verify as verifyPassword } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';
import User from '../users/user.model.js'; 

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(400).json({ msg: 'Credenciales incorrectas - usuario no encontrado!' });
        }

        if (user.estado === false) { 
            return res.status(400).json({ msg: 'El usuario está inactivo!' });
        }

        const isPasswordValid = await verifyPassword(user.password, password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: 'Contraseña incorrecta!' });
        }

        const token = await generarJWT(user._id); 

        return res.status(200).json({
            msg: 'Login completado!',
            userDetails: {
                _id: user._id,
                username: user.username,
                token,
                noCuenta: user.cuentas.length > 0 ? user.cuentas[0] : null, // Assuming the first account is the primary one
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error!',
            error: error.message
        });
    }
};

export const register = async (req, res) => {
    try {
        const {
            name,
            username,
            nickname,
            dpi,
            direccion,
            phone,
            email,
            password,
            profile,
            nombreTrabajo,
            ingresosMensuales,
            role
        } = req.body;

        const existingUser = await User.findOne({
            $or: [{ username }, { email }, { dpi }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Ya existe un usuario con ese username, email o DPI.'
            });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            name,
            username,
            nickname,
            dpi,
            direccion,
            phone,
            email,
            password: hashedPassword,
            profile,
            nombreTrabajo,
            ingresosMensuales,
            role: role || 'CLIENT_ROLE',
            estado: true
        });

        await newUser.save();

        return res.status(201).json({
            message: 'Usuario registrado correctamente',
            userDetails: {
                username: newUser.username,
                noCuenta: newUser.noCuenta
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al crear el usuario',
            error: error.message
        });
    }
};
