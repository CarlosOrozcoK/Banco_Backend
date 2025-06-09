import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
//import { existenteEmail,  } from "../helpers/db-validator.js";

export const registerValidator = [
    body("name", "The naem is required!").not().isEmpty(),
    body("email", "You must enter a valid email!").isEmail(),
    body("password", "Password must be at least 8 cahracters!").isLength({ min: 8 }),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Enter a valid email address!"),
    body("username").optional().isString().withMessage("Enter a valid username!"),
    body("password", "Password must be at least 8 characters!").isLength({ min: 8 }),
    validarCampos
];

export const favoritoValidator = (req, res, next) => {
    const { alias, cuentaDestino, tipo } = req.body;
    if (!alias || !cuentaDestino || !tipo) {
        return res.status(400).json({ error: "Faltan datos del favorito" });
    }
    next();
};

export const favoritoAgregarValidator = [
    body("alias", "El alias es obligatorio").notEmpty(),
    body("cuentaDestino", "La cuenta destino es obligatoria").notEmpty(),
    body("tipo", "El tipo es obligatorio (propia o tercero)")
        .notEmpty()
        .isIn(["propia", "tercero"]),
    validarCampos
];

export const favoritoTransferirValidator = [
    body("monto", "El monto es obligatorio y debe ser mayor a 0")
        .notEmpty()
        .isFloat({ gt: 0 }),
    validarCampos
];

export const favoritoEliminarValidator = [
    validarCampos
];

export const conversionValidator = (req, res, next) => {
    const { cantidad, de, a } = req.query;
    if (!cantidad || !de || !a) {
        return res.status(400).json({ error: "Faltan parámetros de conversión" });
    }
    next();
};