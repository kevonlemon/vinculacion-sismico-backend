import express from "express";
import catalogueController from "../controllers/catalogueController.js";

const catalogueRouter = express.Router();

catalogueRouter.get("/by-type/:type", catalogueController.getCataloguesByType);

export default catalogueRouter;
