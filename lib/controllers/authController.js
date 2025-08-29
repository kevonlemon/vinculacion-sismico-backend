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

export const login = async (req, res) => {
  try {
    const { user, tokens } = await authService.login(req.body);
    return res.status(200).json({ success: true, tokens, userId: user.id });
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const authController = {
  register,
  login,
};
export default authController;
