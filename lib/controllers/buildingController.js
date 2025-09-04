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

const updateBuilding = async (req, res) => {
  try {
    const updatedBuilding = await buildingService.updateBuilding(
      req.params.id,
      { ...req.body },
      {
        foto_edificio: req.files["foto_edificio"]?.[0],
        grafico_edificio: req.files["grafico_edificio"]?.[0],
      }
    );
    res.status(201).json(updatedBuilding);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const deleteBuilding = async (req, res) => {
  try {
    const res = await buildingService.deleteBuilding(req.params.id);
    res.status(201).json(res);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const buildingController = {
  getBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
};

export default buildingController;
