import { Schema, model } from "mongoose";

const UserSchema = Schema(
  {
    username: {
      type: String,
      required: [true, "El username es obligatorio"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [8, "Debe tener al menos 8 caracteres"],
    },
    role: {
      type: String,
      enum: ["CLIENT_ROLE", "ADMIN_ROLE"],
      default: "CLIENT_ROLE",
    },
    estado: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Ocultar campos sensibles
UserSchema.methods.toJSON = function () {
  const { _id, password, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

export default model("User", UserSchema);
