import { Schema, model } from "mongoose";

const creditRequestSchema = Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },

    account: { 
        type: Schema.Types.ObjectId, 
        ref: 'Account', 
        required: true
    },

    amount: { 
        type: Number, 
        required: true 
    },

    status: { 
        type: String, 
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'PAID'], 
        default: 'PENDING' 
    },

    requestedAt: { 
        type: Date, 
        default: Date.now 
    },

    approvedAt: { 
        type: Date 
    },

    dueDate: { 
        type: Date 
    },

    observations: { 
        type: String 
    }

}, { 
    timestamps: true, 
    versionKey: false 
});

creditRequestSchema.methods.toJSON = function () {
    const { _id, ...creditRequest } = this.toObject();
    creditRequest.cid = _id;
    return creditRequest;
}

export default model('CreditRequest', creditRequestSchema);
