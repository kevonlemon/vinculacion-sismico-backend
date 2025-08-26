import * as utils from "../../utils.js";
import authService from "../service/authService.js";

export const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    return res.status(200).json(user);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};
const authController = {
  register
};
export default authController;
