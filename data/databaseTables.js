import dotenv from "dotenv";
dotenv.config();

const schema = process.env.DB_TEST_SCHEMA;
const nombreTabla = `${schema}.nombreTabla`;

const DatabaseTable = {
  nombreTabla,
};
export default DatabaseTable;
