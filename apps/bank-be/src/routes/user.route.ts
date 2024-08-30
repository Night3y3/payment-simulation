import express, { Router } from "express";
import {
  createUser,
  loginUser,
  verifyUser,
} from "../controller/user.controller";

const userRouter = Router();

userRouter.post("/signup", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/verify/:id", verifyUser);

export default userRouter;
