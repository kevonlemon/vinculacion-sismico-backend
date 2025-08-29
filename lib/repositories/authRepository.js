import * as utils from "../../utils.js";
import db from "../../data/database.js";
import AnomalyCode from "../../anomaly.js";
import DatabaseTable from "../../data/databaseTables.js";
import authMiddleware from "../middleware/authMiddleware.js";

const login = async (loginData, lang = "en") => {
  const t = translations[lang];
  const { email, password } = loginData;
  const trx = await db.transaction();
  try {
    const user = await db(DatabaseTable.users)
      .select("id", "nombre", "email", "password_hash")
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
    const tokens = authMiddleware.issueTokens({
      id: user.id,
      email: email,
    });

    await trx.commit();
    return { user, tokens };
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const register = async (userData) => {
  const trx = await db.transaction();
  try {
    const [user] = await trx(DatabaseTable.usuarios)
      .insert(userData)
      .returning(["id_usuario", "nombre", "email"]);
    await trx.commit();
    return user;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const authRepository = { register, login };

export default authRepository;
