import { Schema, model } from 'mongoose';

const transactionSchema = Schema({
    originAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
    },
    destinationAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
    },
    amount: {
        type: Number,
        required: [true, 'Transaction amount is required'],
        min: 0,
    },
    type: {
        type: String,
        required: [true, 'Transaction type is required'],
        enum: [
            'TRANSFER_IN',
            'TRANSFER_OUT',
            'DEPOSIT',
            'WITHDRAW',
            'CREDIT',
            'CREDIT_PAYMENT'
        ],
    },
    description: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true 
});

transactionSchema.methods.toJSON = function () {
    const { _id, ...transaction } = this.toObject();
    transaction.tid = _id;
    return transaction;
}

export default model('Transaction', transactionSchema);