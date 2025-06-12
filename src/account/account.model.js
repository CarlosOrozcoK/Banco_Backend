import { Schema, model } from "mongoose";

const accountSchema = Schema({
    noCuenta: {
        type: String,
        required: [true, "Account number is required"],
        unique: true,
    },
    saldo: {
        type: Number,
        required: [true, "Saldo is required"],
        default: 0,
    },
    tipoCuenta: {
        type: String,
        required: [true, "type is required"],
        enum: ["MONETARIA", "AHORRO"],
    },
    status: {
        type: Boolean,
        default: true,
    },
    });

accountSchema.methods.toJSON = function () {
    const { _id, ...account } = this.toObject();
    account.aid = _id;
    return account;
};

export default model("Account", accountSchema);