import * as utils from "../../utils.js";
import { LoginSchema, RegisterSchema } from "../schema/authSchema.js";
import authRepos from "../repositories/authRepository.js";

const register = async (userData, userProfilePicture) => {
  //VALIDAR FOTO DE PERFIL (DEBE LLEGAR UN FILE)
  let parsedImage;
  utils.isEmptyObject(userProfilePicture) || userProfilePicture === null
    ? (parsedImage = null)
    : (parsedImage = UserPhotoSchema.parse({
        foto_perfil: userProfilePicture,
      }));

  //VALIDAR JSON DE REGISTRO
  let parsedData = RegisterSchema.parse(userData);
  parsedData.password_hash = await utils.hashPassword(parsedData.password);
  delete parsedData.password;
  return await authRepos.register(parsedData, parsedImage);
};

const login = async (loginData) => {
  const parsedData = LoginSchema.parse(loginData);
  return await authRepos.login(parsedData);
};

const authService = { register, login };

export default authService;
