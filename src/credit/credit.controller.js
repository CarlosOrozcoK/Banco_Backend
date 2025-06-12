import CreditRequest from './credit.model.js';
import Account from '../account/account.model.js';
import Transaction from '../transactions/transactions.model.js';

// Cliente solicita un crédito
export const requestCredit = async (req, res) => {
    const { amount, accountId, observations } = req.body;
    const userId = req.usuario?._id || req.userId || req.user?.id;

    try {
        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ 
                msg: "Account not found or inactive" 
            });
        }

        const credit = await CreditRequest.create({
            user: userId,
            account: accountId,
            amount,
            observations
        });

        return res.status(201).json({ 
            msg: "Credit request submitted",
            credit 
        });
    } catch (err) {
        res.status(500).json({ 
            msg: "Error requesting credit",
            error: err.message 
        });
    }
};

// Admin: listar solicitudes de crédito (puedes filtrar por estado)
export const listCreditRequests = async (req, res) => {
    const { status = 'PENDING' } = req.query;
    try {
        const credits = await CreditRequest.find({ status })
            .populate('user', 'name email dpi ingresosMensuales')
            .populate('account', 'noCuenta tipoCuenta');
        
        return res.json({
            credits
        });
    } catch (err) {
        return res.status(500).json({ 
            msg: "Error fetching credit requests", 
            error: err.message 
        });
    }
};

// Admin: aprobar/rechazar crédito
export const processCreditRequest = async (req, res) => {
    const { creditId } = req.params;
    const { approve, dueDate, observations } = req.body;

    try {
        const credit = await CreditRequest.findById(creditId);
        if (!credit || credit.status !== 'PENDING') {
            return res.status(404).json({ 
                msg: "Credit request not found or already processed" 
            });
        }

        if (approve) {
            credit.status = 'APPROVED';
            credit.approvedAt = new Date();
            credit.dueDate = dueDate;
            credit.observations = observations;

            // Suma el monto a la cuenta y crea transacción tipo CREDITO
            const account = await Account.findById(credit.account);
            account.saldo = Number((account.saldo + credit.amount).toFixed(2));
            await account.save();

            await Transaction.create({
                originAccount: null,
                destinationAccount: account._id,
                amount: credit.amount,
                type: 'CREDIT',
                description: `Credit approved. Due date: ${dueDate}`,
                Saldo: account.saldo
            });
        } else {
            // Rechaza el crédito
            credit.status = 'REJECTED';
            credit.observations = observations;
        }

        await credit.save();

        return res.json({ 
            msg: "Credit request processed", 
            credit 
        });

    } catch (err) {
        return res.status(500).json({ 
            msg: "Error processing credit request", 
            error: err.message 
        });
    }
};

// Cliente: pagar crédito
export const payCredit = async (req, res) => {
    const { creditId } = req.params;
    const { accountId, amount } = req.body;
    const userId = req.usuario?._id || req.userId || req.user?.id;

    try {
        const credit = await CreditRequest.findById(creditId);
        if (!credit || credit.status !== 'APPROVED') {
            return res.status(404).json({
                msg: "Credit not found or not approved" 
            });
        }

        const account = await Account.findById(accountId);
        if (!account || !account.status) {

            return res.status(404).json({ 
                msg: "Account not found or inactive" 
            });
        }

        if (account.saldo < amount) {
            return res.status(400).json({
                msg: "Insufficient funds" 
            });
        }

        account.saldo = Number((account.saldo - amount).toFixed(2));
        await account.save();

        // Registrar pago en transacciones
        await Transaction.create({
            originAccount: account._id,
            destinationAccount: null,
            amount: amount,
            type: 'CREDIT_PAYMENT',
            description: `Credit payment for credit #${creditId}`,
            saldo: account.saldo
        });

        // Actualiza estado del crédito si se pagó completo
        if (amount >= credit.amount) {
            credit.status = 'PAID';
        }
        await credit.save();

        return res.json({
            msg: "Credit payment successful", 
            credit });
    } catch (err) {
        return res.status(500).json({
            msg: "Error paying credit", 
            error: err.message 
        });
    }
};
