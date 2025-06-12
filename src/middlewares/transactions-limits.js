import Transaction from "../transactions/transactions.model.js";

// Valida que el amount de la transferencia no supere $2000 y el total diario no supere $10000
export const validateTransferLimits = async (req, res, next) => {
    const { amount } = req.body;
    const originAccountId = req.params.originAccount;

    if (amount > 2000) {
        return res.status(400).json({
            msg: "You cannot transfer more than $2000 per transaction." 
        });
    }

    // Calculate total transferred today from this account
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const totalToday = await Transaction.aggregate([
        {
            $match: {
                cuentaOrigen: originAccountId,
                tipoTransaccion: { $in: ["TRANSFERENCIA_IN", "TRANSFERENCIA_OUT"] },
                createdAt: { $gte: startOfDay }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$amount" }
            }
        }
    ]);

    const total = totalToday[0]?.total || 0;
    if (total + amount > 10000) {
        return res.status(400).json({ msg: "You cannot transfer more than $10000 per day from this account." });
    }

    next();
};

// Valida que solo se pueda actualizar un depósito dentro de 1 minuto de su creación
export const validateDepositUpdateTimeLimit = async (req, res, next) => {
    const { transactionId } = req.params;

    const tx = await Transaction.findById(transactionId);

    if (!tx) {
        return res.status(404).json({ msg:
            "Deposit not found." 
        });
    }

    if(tx.type !== 'DEPOSIT') {
        return res.status(400).json({ 
            msg: "Transaction is not a deposit." 
        });
    }

    const now = new Date();
    const createdAt = tx.date;

    if (!createdAt) {
        return res.status(400).json({ 
            msg: "Could not determine deposit creation date." 
        });
    }

    const diffMs = now - new Date(createdAt);
    if (diffMs > 60 * 1000) { 
        return res.status(400).json({ 
            msg: "You can only update the deposit within 1 minute of its creation." 
        });
    }

    next();
};

// Valida que un depósito solo se pueda revertir dentro de 1 minuto de su creación
export const validateDepositRevertTimeLimit = async (req, res, next) => {
    const { transactionId } = req.params;
    const tx = await Transaction.findById(transactionId);

    if (!tx) {
        return res.status(404).json({ msg: 
            "Deposit not found." 
        });
    }

    if(tx.type !== 'DEPOSIT') {
        return res.status(400).json({ 
            msg: "Transaction is not a deposit." 
        });
    }

    const now = new Date();
    const createdAt = tx.date;
    if (!createdAt) {
        return res.status(400).json({ 
            msg: "Could not determine deposit creation date." 
        });
    }

    const diffMs = now - new Date(createdAt);
    if (diffMs > 60 * 1000) {
        return res.status(400).json({
            msg: "You can only revert the deposit within 1 minute of its creation." 
        });
    }

    next();
};
