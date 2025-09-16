import { Sequelize } from 'sequelize';
import { logger } from './config/logger';
import dotenv from 'dotenv';

dotenv.config();

// Función para crear la base de datos si no existe
export const createDatabaseIfNotExists = async () => {
  const sequelizeWithoutDB = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    logging: false,
  });

  try {
    await sequelizeWithoutDB.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    logger.info(`✅ Base de datos '${process.env.DB_NAME}' verificada/creada`);
    await sequelizeWithoutDB.close();
  } catch (error) {
    logger.error('❌ Error al crear la base de datos:', error);
    await sequelizeWithoutDB.close();
    throw error;
  }
};

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Función para probar la conexión
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    logger.error('❌ No se pudo conectar a la base de datos:', error);
  }
};

export default sequelize;