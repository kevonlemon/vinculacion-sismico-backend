import express from "express";
import multer from "multer";
import authController from "../controllers/authController.js";

const authRouter = express.Router();

// authRouter.post("/login", authController.login);
 authRouter.post("/register", authController.register);

export default authRouter;
