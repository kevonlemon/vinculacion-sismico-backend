import * as utils from "../../utils.js";
import db from "../../data/database.js";
import AnomalyCode from "../../anomaly.js";
import DatabaseTable from "../../data/databaseTables.js";
import authMiddleware from "../middleware/authMiddleware.js";
import bucket from "../firebase/firebase.js";

const login = async (loginData) => {
  const { email, password } = loginData;
  const trx = await db.transaction();
  try {
    const user = await db(DatabaseTable.usuarios)
      .select("id_usuario", "nombre", "email", "password_hash")
      .where({ email: email })
      .first();

    if (!user) {
      throw new utils.CustomError(
        AnomalyCode.userDoesNotExist,
        "EL usuario no existe"
      );
    }
    const isMatch = await utils.verifyPassword(password, user.password_hash);
    if (!isMatch) {
      throw new utils.CustomError(AnomalyCode.wrongPassword, t.wrongPassword);
    }

    // Emitimos access y refresh tokens
    const token = authMiddleware.issueTokens({
      id: user.id_usuario,
      email: email,
    });

    await trx.commit();
    return { user, token };
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const register = async (userData, parsedImage) => {
  const domainUrl = process.env.DOMAIN_URL_FIREBASE_STORAGE;
  const trx = await db.transaction();
  try {
    let profilePictureUrl = "";
    if (parsedImage) {
      // nombre único del archivo
      const fileName = `users/${Date.now()}-${
        parsedImage.foto_perfil.originalname
      }`;
      const file = bucket.file(fileName);
      // subir a Firebase
      await file.save(parsedImage.foto_perfil.buffer, {
        metadata: { contentType: parsedImage.foto_perfil.mimetype },
      });
      await file.makePublic();
      // URL pública
      profilePictureUrl = `${domainUrl}/${bucket.name}/${fileName}`;
    }

    userData.foto_perfil_url = profilePictureUrl;
    const [user] = await trx(DatabaseTable.usuarios)
      .insert(userData)
      .returning([
        "id_usuario",
        "nombre",
        "email",
        "cedula",
        "foto_perfil_url",
      ]);
    await trx.commit();
    return user;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const authRepository = { register, login };

export default authRepository;
