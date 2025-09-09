import * as utils from "../../utils.js";
import db from "../../data/database.js";
import AnomalyCode from "../../anomaly.js";
import DatabaseTable from "../../data/databaseTables.js";
import bucket from "../firebase/firebase.js";

const getUsersByRole = async (role) => {
  try {
    const users = await db(DatabaseTable.usuarios)
      .select("id_usuario", "nombre", "email")
      .where({ rol: role });
    return users;
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener los usuarios"
    );
  }
};

const updateUser = async (userId, userData, parsedImage) => {
  const domainUrl = process.env.DOMAIN_URL_FIREBASE_STORAGE;
  const trx = await db.transaction();
  let uploadedFile = null;
  let oldImageUrl = null;

  try {
    // Validar contraseña anterior si se quiere cambiar la contraseña
    if (userData.password && userData.currentPassword) {
      const currentUser = await trx(DatabaseTable.usuarios)
        .select("password_hash")
        .where("id_usuario", userId)
        .first();

      if (!currentUser) {
        throw new utils.CustomError(
          AnomalyCode.userDoesNotExist,
          "Usuario no encontrado"
        );
      }

      const isCurrentPasswordValid = await utils.verifyPassword(
        userData.currentPassword,
        currentUser.password_hash
      );

      if (!isCurrentPasswordValid) {
        throw new utils.CustomError(
          AnomalyCode.wrongPassword,
          "La contraseña actual es incorrecta"
        );
      }

      // Hash de la nueva contraseña
      userData.password_hash = await utils.hashPassword(userData.password);
      delete userData.password;
      delete userData.currentPassword;
    } else if (userData.password && !userData.currentPassword) {
      throw new utils.CustomError(
        AnomalyCode.missingData,
        "Debe proporcionar la contraseña actual para cambiarla"
      );
    }

    // Obtener la imagen actual del usuario para eliminarla después
    if (parsedImage) {
      const currentUser = await trx(DatabaseTable.usuarios)
        .select("foto_perfil_url")
        .where("id_usuario", userId)
        .first();
      
      oldImageUrl = currentUser?.foto_perfil_url;
    }

    let profilePictureUrl = "";
    if (parsedImage) {
      // nombre único del archivo
      const fileName = `users/${Date.now()}-${
        parsedImage.foto_perfil.originalname
      }`;
      const file = bucket.file(fileName);
      uploadedFile = file;
      // subir a Firebase
      await file.save(parsedImage.foto_perfil.buffer, {
        metadata: { contentType: parsedImage.foto_perfil.mimetype },
      });
      await file.makePublic();
      // URL pública
      profilePictureUrl = `${domainUrl}/${bucket.name}/${fileName}`;
      userData.foto_perfil_url = profilePictureUrl;
    }

    const [user] = await trx(DatabaseTable.usuarios)
      .update(userData)
      .where("id_usuario", userId)
      .returning([
        "id_usuario",
        "nombre",
        "email",
        "cedula",
        "foto_perfil_url",
      ]);

    // Eliminar la imagen anterior de Firebase si se subió una nueva
    if (parsedImage && oldImageUrl && oldImageUrl.includes(bucket.name)) {
      try {
        const oldFileName = oldImageUrl.split(`${bucket.name}/`)[1];
        const oldFile = bucket.file(oldFileName);
        await oldFile.delete();
        console.log('Imagen anterior eliminada de Firebase');
      } catch (cleanupError) {
        console.error('Error al eliminar imagen anterior:', cleanupError);
      }
    }

    await trx.commit();
    return user;
  } catch (error) {
    await trx.rollback();
    if (uploadedFile) {
      try {
        await uploadedFile.delete();
        console.log('Imagen eliminada de Firebase debido a error en BD');
      } catch (cleanupError) {
        console.error('Error al limpiar imagen de Firebase:', cleanupError);
      }
    }
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};
const getUserById = async (userId) => {
  try {
    const user = await db(DatabaseTable.usuarios)
      .select("id_usuario", "nombre", "email", "cedula", "telefono", "rol", "direccion", "foto_perfil_url")
      .where("id_usuario", userId)
      .first();
    
    return user;
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener el usuario"
    );
  }
};
const updateUserRole = async (userId, newRole) => {
  const trx = await db.transaction();
  
  try {
    const user = await getUserById(userId);

    if (!user) {
      throw new utils.CustomError(
        AnomalyCode.userDoesNotExist,
        "Usuario no encontrado"
      );
    }

    // Actualizar el rol
    const [updatedUser] = await trx(DatabaseTable.usuarios)
      .update({ rol: newRole })
      .where("id_usuario", userId)
      .returning([
        "id_usuario",
        "nombre", 
        "email",
        "rol"
      ]);

    await trx.commit();
    return updatedUser;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const userRepository = {
  getUsersByRole,
  updateUser,
  getUserById,
  updateUserRole,
};

export default userRepository;
