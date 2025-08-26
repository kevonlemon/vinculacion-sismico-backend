// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
import dotenv from "dotenv";
dotenv.config();

const knexConfiguration = {
  development: {
    client: process.env.KNEX_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export default knexConfiguration;
