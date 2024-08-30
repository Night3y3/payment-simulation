import { Response, Request } from "express";
import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

import { User, UserInput } from "../model/user.model";
import sendMail from "../utils/sendMail";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, number }: UserInput = req.body;

    if (!fullName || !email || !password || !number) {
      throw new Error("Please provide all required fields");
    }

    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection nahi hua");
    }

    const existingUser = await User.findOne({ email }).exec();

    if (existingUser) {
      return res.status(409).json({
        message: existingUser.verified
          ? "Email is already in use. Please login."
          : "Email is already in use. Please verify your email address.",
      });
    }

    const hashedPassword = await bcrypt.hash(password as unknown as string, 10);

    const userInput: UserInput = {
      fullName,
      email,
      password: hashedPassword as unknown as Schema.Types.String,
      number,
    };
    const userCreated = await User.create(userInput);

    const verificationToken = userCreated.generateVerificationToken();
    const verificationLink = `${process.env.BASE_URL}/api/verify/${verificationToken}`;

    const emailSent = await sendMail(
      email as unknown as string,
      verificationLink
    );

    if (emailSent) {
      return res.status(201).json({
        message: `Sent a verification email to ${email}`,
        user: userCreated,
      });
    } else {
      return res.status(500).json({
        message: "User created but failed to send verification email",
        user: userCreated,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email address" });
    }

    const passwordValidation = await bcrypt.compare(
      password,
      user.password as unknown as string
    );

    if (!passwordValidation) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  const verificationToken = req.params.id;

  if (!verificationToken) {
    return res.status(422).send({
      message: "Missing Token",
    });
  }

  try {
    const payload = jwt.verify(
      verificationToken,
      process.env.JWT_SECRET as Secret
    ) as JwtPayload;

    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    const user = await User.findOne({ email: payload.email }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    user.verified = true as unknown as Schema.Types.Boolean;
    await user.save();

    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.error("Error verifying user:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
