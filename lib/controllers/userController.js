import * as utils from "../../utils.js";
import userService from "../service/userService.js";

export const getInspectors = async (req, res) => {
  try {
    const inspectors = await userService.getAllInspectors();
    res.status(200).json(inspectors);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const userController = { getInspectors };

export default userController;
