import { Schema, model } from "mongoose";

function generarNumeroCuenta() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, "The name is required!"],
        maxLength: 25,
    },

    username: {
        type: String,
        unique: true,
        required: [true, "The username is required!"],
    },

    nickname: {
        type: String,
        trim: true,
    },

    noCuenta: {
        type: String,
        unique: true,
    },
    
    cuentas: [{
        type: Schema.Types.ObjectId,
        ref: 'Account',
        default: []
    }],

    dpi: {
        type: String,
        required: [true, "The DPI is required!"],
        unique: true,
        trim: true,
    },

    direccion: {
        type: String,
        required: [true, "The address is required!"],
    },

    phone: {
        type: String,
        required: [true, "The phone is required!"],
        minLength: 8,
        maxLength: 8,
    },

    email: {
        type: String,
        required: [true, "The email is required!"],
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: [true, "The password is required!"],
        minLength: [8, "8 minimum characters!"],
    },

    profile: {
        type: String,
    },

    nombreTrabajo: {
        type: String,
        required: [true, "The job name is required!"],
    },

    ingresosMensuales: {
        type: Number,
        required: [true, "Monthly income is required!"],
        min: [100, "Income must be at least Q100"],
    },

    role: {
        type: String,
        enum: ['CLIENT_ROLE', 'ADMIN_ROLE'],
        default: "CLIENT_ROLE",
    },

    estado: {
        type: Boolean,
        default: true,
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);

UserSchema.pre("save", function (next) {
    if (!this.noCuenta) {
        this.noCuenta = generarNumeroCuenta();
    }
    next();
});

UserSchema.methods.toJSON = function () {
    const { password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
};

export default model('User', UserSchema);
