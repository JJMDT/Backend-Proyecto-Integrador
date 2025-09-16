import User from './userModel';
import  sequelize  from '../db';
import { logger } from '../config/logger';

// Exportar todos los modelos
export {
  User
};

// Función para sincronizar la base de datos
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force }); // force: true eliminará y recreará las tablas
    logger.info('✅ Modelos sincronizados con la base de datos');
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
