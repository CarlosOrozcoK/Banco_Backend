import Account from "./account.model.js";
import User from "../users/user.model.js";
import generarNumeroCuenta from "../helpers/generar-no-cuenta.js";

export const createAccount = async (req, res) => {
    try {
        const { userId, tipoCuenta, saldo = 0 } = req.body;

        const user = await User.findById(userId);

        //console.log("User found:", user);

        if (!user) {
        return res.status(404).json({ 
            msg: "User not found or inactive" 
            });
        }

        let noCuenta;

        noCuenta = await generarNumeroCuenta();

        const nuevaCuenta = new Account({
        noCuenta,
        tipoCuenta,
        saldo,
        });

        await nuevaCuenta.save();

        user.cuentas.push(nuevaCuenta.id);
        await user.save();

        return res.status(201).json({
        msg: "Account created successfully",
        account: nuevaCuenta,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const getAccounts = async (req, res) => {
    try {
        const { limit = 10, from = 0 } = req.query;

        const query = { status: true };

        const [total, accounts] = await Promise.all([
        Account.countDocuments(query),
        Account.find(query)
            .skip(Number(from))
            .limit(Number(limit))
            .sort({ createdAt: -1 })
        ]);

        return res.status(200).json({
        success: true,
        total,
        accounts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        msg: "Error fetching accounts",
        error: error.message,
        });
    }
};

export const getAccountById = async (req, res) => {
    try {
        const { aid } = req.params;

        const account = await Account.findById(aid).populate("user", "name email");

        if (!account || !account.status) {
            return res.status(404).json({ msg: "Account not found or inactive" });
        }

        return res.status(200).json({
            success: true,
            account,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching account",
            error: error.message,
        });
    }
};

export const getAccountsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate("cuentas");

        if (!user) {
            return res.status(404).json({ msg: "User not found or inactive" });
        }

        return res.status(200).json({
            success: true,
            accounts: user.cuentas,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching accounts by user",
            error: error.message,
        });
    }
}