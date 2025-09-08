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

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    return res.status(200).json(user);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id || req.user?.id;
    const user = await userService.updateUser(userId, { ...req.body }, { ...req.file });
    return res.status(200).json(user);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await userService.updateUserRole(userId, { ...req.body });
    return res.status(200).json(updatedUser);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const userController = { getInspectors, updateUser, getUserById, updateUserRole };

export default userController;
