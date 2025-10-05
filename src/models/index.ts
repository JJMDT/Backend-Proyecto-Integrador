import User from './userModel';
import sequelize from '../db';
import { logger } from '../config/logger';
import {Professional} from '../models/professionalModel'

// Exportar todos los modelos
export {
  User,
  Professional
};

// Función para sincronizar la base de datos
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force }); // force: true eliminará y recreará las tablas
    logger.info('✅ Modelos sincronizados con la base de datos');
    const allSchemas =  (await (sequelize as any).showAllSchemas()).map((el:any) => el.Tables_in_proyecto_integrador);
    logger.info(`Todos los Models(Tables) en la  Data Base ${process.env.DB_NAME}: ${allSchemas.join(', ')}`)
    logger.info('Modelos(Tablas) Data Base OK');
  } catch (error) {
    logger.error('❌ Error al sincronizar modelos:', error);
    throw error;
  }
};

// NO SE USA - Función para inicializar relaciones entre modelos
// export const initModels = async () => {
//   try {
//     // Aquí puedes agregar relaciones entre modelos cuando las tengas
//     // User.hasMany(Post);
//     // Post.belongsTo(User);
//
//     console.log('✅ Modelos inicializados correctamente');
//   } catch (error) {
//     console.error('❌ Error al inicializar modelos:', error);
//     throw error;
//   }
// };
