import * as utils from "../../utils.js";
import AnomalyCode from "../../anomaly.js";
import userRepository from "../repositories/userRepository.js";

const getAllInspectors = async () => {
  try {
    const inspectors = await userRepository.getInspectors();
    return inspectors;
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener los inspectores"
    );
  }
};

const userService = { getAllInspectors };

export default userService;
