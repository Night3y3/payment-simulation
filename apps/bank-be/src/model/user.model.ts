import mongoose, { Document, Model, Schema } from "mongoose";
import jwt from "jsonwebtoken";

type UserDocument = Document & {
  fullName: Schema.Types.String;
  email: Schema.Types.String;
  password: Schema.Types.String;
  number: Schema.Types.Number;
  verified: Schema.Types.Boolean;
  generateVerificationToken: () => string;
};

type UserInput = {
  fullName: UserDocument["fullName"];
  email: UserDocument["email"];
  password: UserDocument["password"];
  number: UserDocument["number"];
};

const userSchema = new Schema(
  {
    fullName: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    number: {
      type: Schema.Types.Number,
      required: true,
      unique: true,
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.methods.generateVerificationToken = function () {
  const user = this;

  const verificationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  return verificationToken;
};

const User: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  userSchema
);

export { User };
export type { UserDocument, UserInput };
