import * as utils from "../../utils.js";
import buildingService from "../service/buildingService.js";

const getBuildings = async (req, res) => {
  try {
    const buildings = await buildingService.getBuildings();
    res.status(200).json(buildings);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const createBuilding = async (req, res) => {
  try {
    const newBuilding = await buildingService.createBuilding(
      { ...req.body },
      {
        foto_edificio: req.files["foto_edificio"]?.[0],
        grafico_edificio: req.files["grafico_edificio"]?.[0],
      }
    );
    res.status(201).json(newBuilding);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const buildingController = { getBuildings, createBuilding };

export default buildingController;
