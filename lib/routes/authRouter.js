import express from "express";
import multer from "multer";

const authRouter = express.Router();

authRouter.post("/register", authController.register);

export default authRouter;
