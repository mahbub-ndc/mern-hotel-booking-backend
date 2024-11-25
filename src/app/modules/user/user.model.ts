import mongoose from "mongoose";
import { UserType } from "./user.interface";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema<UserType>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(user.password, 10);
  next();
});

export const User = mongoose.model<UserType>("User", userSchema);
