import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import buildingController from "../controllers/buildingController.js";
import sessionMiddleware from "../middleware/sessionMiddleware.js";
import multer from "multer";

const buildingRouter = express.Router();
buildingRouter.use(authMiddleware.authenticateUser.bind(authMiddleware));
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

buildingRouter.get(
  "/",
  sessionMiddleware.addSession,
  buildingController.getBuildings
);
buildingRouter.post(
  "/",
  sessionMiddleware.addSession,
  upload.fields([
    { name: "foto_edificio", maxCount: 1 },
    { name: "grafico_edificio", maxCount: 1 },
  ]),
  buildingController.createBuilding
);

export default buildingRouter;
