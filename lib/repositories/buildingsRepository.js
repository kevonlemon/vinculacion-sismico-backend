import * as utils from "../../utils.js";
import db from "../../data/database.js";
import AnomalyCode from "../../anomaly.js";
import DatabaseTable from "../../data/databaseTables.js";
import bucket from "../firebase/firebase.js";
import { url } from "zod";

const getBuildings = async () => {
  try {
    const buildings = await db(DatabaseTable.edificios).select("*");
    return buildings;
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener los edificios"
    );
  }
};

const uploadBuildingFiles = async (buildingData, bucket, domainUrl) => {
  const result = {urls: {},fileRefs:[]};

  const uploadFile = async (file, folder) => {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    const storageFile = bucket.file(fileName);

    await storageFile.save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });
    await storageFile.makePublic();

    result.fileRefs.push(storageFile);

    return `${domainUrl}/${bucket.name}/${fileName}`;
  };

  if (buildingData.foto_edificio) {
    result.urls.foto_edificio_url = await uploadFile(
      buildingData.foto_edificio,
      "building/foto"
    );
  }

  if (buildingData.grafico_edificio) {
    result.urls.grafico_edificio_url = await uploadFile(
      buildingData.grafico_edificio,
      "building/grafico"
    );
  }

  return result;
};

const createBuilding = async (buildingData) => {
  const domainUrl = process.env.DOMAIN_URL_FIREBASE_STORAGE;
  const trx = await db.transaction();
  let uploadedFiles = [];

  try {
    const uploadedResult = await uploadBuildingFiles(
      buildingData,
      bucket,
      domainUrl
    );

    uploadedFiles = uploadedResult.fileRefs;
  
    buildingData = {
      ...buildingData,
      ...uploadedResult.urls,
    };

    delete buildingData.foto_edificio;
    delete buildingData.grafico_edificio;

    const building = await trx(DatabaseTable.edificios)
      .insert(buildingData)
      .returning("*");

    await trx.commit();
    return building[0];
  } catch (error) {
    await trx.rollback();
    if (uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        try {
          await file.delete();
          console.log(`Archivo eliminado de Firebase: ${file.name}`);
        } catch (cleanupError) {
          console.error(`Error al eliminar archivo ${file.name}:`, cleanupError);
        }
      }
    }
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

// ARCHIVO: buildingsRepository.js - CORRECCIONES NECESARIAS

const updateBuilding = async (buildingId, buildingData) => {
  const domainUrl = process.env.DOMAIN_URL_FIREBASE_STORAGE;
  const trx = await db.transaction();
  let uploadedFiles = []; // AGREGAR: Para manejo de cleanup en caso de error
  
  try {
    const uploadedResult = await uploadBuildingFiles(
      buildingData,
      bucket,
      domainUrl
    );

    // CORRECCIÓN CRÍTICA: Solo usar .urls, no todo el objeto
    uploadedFiles = uploadedResult.fileRefs; // AGREGAR: Para cleanup
    
    buildingData = {
      ...buildingData,
      ...uploadedResult.urls, // ✅ CAMBIO: Era ...uploadedUrls (todo el objeto)
    };

    // Limpiar propiedades de archivos que ya no son necesarias
    delete buildingData.foto_edificio;
    delete buildingData.grafico_edificio;

    const building = await trx(DatabaseTable.edificios)
      .update(buildingData)
      .where("id_edificio", buildingId)
      .returning("*");

    await trx.commit();
    return building[0];
  } catch (error) {
    await trx.rollback();
    
    // AGREGAR: Cleanup de archivos en caso de error (igual que en createBuilding)
    if (uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        try {
          await file.delete();
          console.log(`Archivo eliminado de Firebase: ${file.name}`);
        } catch (cleanupError) {
          console.error(`Error al eliminar archivo ${file.name}:`, cleanupError);
        }
      }
    }
    
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const deleteBuilding = async (buildingId) => {
  const trx = await db.transaction();
  try {
    let res = await trx(DatabaseTable.edificios)
      .where("id_edificio", buildingId)
      .delete();
    await trx.commit();
    return res > 0;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const buildingRepository = {
  getBuildings,
  createBuilding,
  deleteBuilding,
  updateBuilding,
};

export default buildingRepository;
