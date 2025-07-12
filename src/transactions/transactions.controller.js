import Transaction from './transactions.model.js';
import Account from '../account/account.model.js';

// CLIENT - Realizar transferencia
export const makeTransfer = async (req, res) => {
    try {
        const originAccountId = req.params.originAccount;
        const { destinationAccount, amount, description = "" } = req.body;

        if (!destinationAccount) {
            return res.status(400).json({
                msg: "Destination account is required"
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                msg: "Amount must be greater than zero"
            });
        }

        const origin = await Account.findById(originAccountId);
        const destination = await Account.findById(destinationAccount);

        if (!origin || !origin.status) {
            return res.status(404).json({
                msg: "Origin account not found or inactive"
            });
        }

        if (!destination || !destination.status) {
            return res.status(404).json({
                msg: "Destination account not found or inactive"
            });
        }

        if (origin.saldo < amount) {
            return res.status(400).json({
                msg: "Insufficient funds"
            });
        }

        // Actualizar saldos
        origin.saldo = Number((origin.saldo - amount).toFixed(2));
        destination.saldo = Number((destination.saldo + amount).toFixed(2));

        await origin.save();
        await destination.save();

        // Registrar transacción de salida
        const transferOut = new Transaction({
            originAccount: origin._id,
            destinationAccount: destination._id,
            amount: amount,
            type: "TRANSFER_OUT",
            description: description,
        });
        await transferOut.save();

        // Registrar transacción de entrada
        const transferIn = new Transaction({
            originAccount: origin._id,
            destinationAccount: destination._id,
            amount: amount,
            type: "TRANSFER_IN",
            description: description,
        });
        await transferIn.save();

        return res.status(201).json({
            msg: "Transfer completed successfully",
            transferOut,
            transferIn
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: "Server error",
            error: err.message
        });
    }
};

// ADMIN - Hacer depósito
export const makeDeposit = async (req, res) => {
    try {
        const { destinationAccount, amount, description = '' } = req.body;

        if (!destinationAccount || !amount) {
            return res.status(400).json({
                msg: 'Destination account and amount are required'
            });
        }

        const destination = await Account.findById(destinationAccount);

        if (!destination || !destination.status) {
            return res.status(404).json({
                msg: 'Destination account not found or inactive'
            });
        }

        destination.saldo = Number((destination.saldo + Number(amount)).toFixed(2));
        await destination.save();

        const tx = await Transaction.create({
            originAccount: destinationAccount,
            destinationAccount: destinationAccount,
            amount: Number(amount),
            type: 'DEPOSIT',
            description,
            status: true
        });

        return res.status(201).json({
            msg: 'Deposit successful',
            transaction: tx,
            newBalance: destination.saldo
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Server error',
            error: err.message
        });
    }
};


// ADMIN - Actualizar cantidad de un depósito
export const updateDepositAmount = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { newAmount } = req.body;

        const tx = await Transaction.findById(transactionId);
        if (!tx || tx.type !== 'DEPOSIT') {
            return res.status(404).json({
                msg: 'Deposit not found'
            });
        }

        const account = await Account.findById(tx.destinationAccount);
        if (!account) {
            return res.status(404).json({
                msg: 'Account not found'
            });
        }

        account.saldo = Number((account.saldo + (Number(newAmount) - Number(tx.amount))).toFixed(2));
        tx.amount = newAmount;

        await Promise.all([tx.save(), account.save()]);

        return res.status(200).json({
            msg: 'Deposit updated',
            transaction: tx,
            newBalance: account.saldo
        });
    } catch (err) {
        return res.status(500).json({
            msg: 'Server error',
            error: err.message
        });
    }
};

// ADMIN - Revertir depósito
export const revertDepositAmount = async (req, res) => {
    try {
        const { transactionId } = req.params;

        const tx = await Transaction.findById(transactionId);

        if (!tx || tx.type !== 'DEPOSIT' || !tx.status) {
            return res.status(404).json({
                msg: 'Active deposit not found'
            });
        }

        const account = await Account.findById(tx.destinationAccount);

        if (!account) {
            return res.status(404).json({
                msg: 'Account not found'
            });
        }

        account.saldo = Number((account.saldo - Number(tx.amount)).toFixed(2));
        tx.status = false;

        await Promise.all([account.save(), tx.save()]);

        return res.status(200).json({
            msg: 'Deposit reverted',
            transaction: tx,
            newBalance: account.saldo
        });
    } catch (err) {
        return res.status(500).json({
            msg: 'Server error',
            error: err.message
        });
    }
};

// ADMIN - Listar movimientos de una cuenta
export const getAccountMovements = async (req, res) => {
    try {
        const { accountId } = req.params;
        const { limit = 10, from = 0 } = req.query;

        const query = {
            $or: [
                { originAccount: accountId },
                { destinationAccount: accountId }
            ]
        };

        const [total, transactions] = await Promise.all([
            Transaction.countDocuments(query),
            Transaction.find(query)
                .skip(Number(from))
                .limit(Number(limit))
                .sort({ createdAt: -1 })
                .populate('originAccount', 'noCuenta tipoCuenta')
                .populate('destinationAccount', 'noCuenta tipoCuenta')
        ]);

        return res.status(200).json({
            total, transactions
        });
    } catch (err) {
        return res.status(500).json({
            msg: 'Error getting movements',
            error: err.message
        });
    }
};

// ADMIN - Top cuentas con más movimientos
export const getTopMovements = async (req, res) => {
    try {
        const order = req.query.order === 'asc' ? 1 : -1;
        const top = await Transaction.aggregate([
            {
                $facet: {
                    asOrigin: [
                        { $group: { _id: "$originAccount", total: { $sum: 1 } } }
                    ],
                    asDestination: [
                        { $group: { _id: "$destinationAccount", total: { $sum: 1 } } }
                    ]
                }
            },
            {
                $project: {
                    combined: {
                        $concatArrays: ["$asOrigin", "$asDestination"]
                    }
                }
            },
            { $unwind: "$combined" },
            {
                $group: {
                    _id: "$combined._id",
                    totalMovements: { $sum: "$combined.total" }
                }
            },
            { $sort: { totalMovements: order } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "accounts",
                    localField: "_id",
                    foreignField: "_id",
                    as: "account"
                }
            },
            { $unwind: "$account" },
            {
                $project: {
                    _id: 0,
                    accountId: "$account._id",
                    noCuenta: "$account.noCuenta",
                    tipoCuenta: "$account.tipoCuenta",
                    totalMovements: 1
                }
            }
        ]);

        return res.status(200).json({
            top
        });
    } catch (err) {
        return res.status(500).json({
            msg: 'Error fetching top movements',
            error: err.message
        });
    }
};

// CLIENT - Mis últimos 5 movimientos
export const getMyRecentMovements = async (req, res) => {
    try {
        const { usuario } = req;

        const txs = await Transaction.find({
            $or: [
                { originAccount: { $in: usuario.cuentas } },
                { destinationAccount: { $in: usuario.cuentas } }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('originAccount', 'noCuenta tipoCuenta')
            .populate('destinationAccount', 'noCuenta tipoCuenta');

        return res.status(200).json({
            transactions: txs
        });
    } catch (err) {
        return res.status(500).json({
            msg: 'Error fetching recent movements',
            error: err.message
        });
    }
};
