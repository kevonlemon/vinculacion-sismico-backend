import * as utils from "../../utils.js";
import authService from "../service/authService.js";

export const register = async (req, res) => {
  try {
    const user = await authService.register({ ...req.body }, { ...req.file });
    return res.status(200).json(user);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export const login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    return res
      .status(200)
      .json({ success: true, token, userId: user.id_usuario });
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const authController = {
  register,
  login,
};
export default authController;
