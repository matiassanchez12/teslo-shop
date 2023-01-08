import mongoose, { Schema, model, Model } from "mongoose";
import { IUser } from "../interfaces";

const useSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: {
        values: ["admin", "client", "super-user", "seo"],
        message: "{VALUE} no es un role válido",
        default: "client",
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

//Si ya existe en mongoose el model de usuario o se crea con el metodo model()
const User: Model<IUser> = mongoose.models.User || model("User", useSchema);

export default User;
