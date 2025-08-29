import express from "express";
import authController from "../controllers/authController.js";
import multer from "multer";

const authRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

authRouter.post("/login", authController.login);
authRouter.post(
  "/register",
  upload.single("foto_perfil"),
  authController.register
);
export default authRouter;
