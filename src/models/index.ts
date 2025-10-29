import User from './userModel';
import sequelize from '../db';
import { logger } from '../config/logger';
import Professional from './professionalModel';
import Service from './serviceModel';
import Appointment from './appointmentModel';

// Exportar todos los modelos
export {
  User,
  Professional,
  Service,
  Appointment
};

// Función para sincronizar la base de datos
export const syncDatabase = async (force = false) => {
  try {
    // Inicializar relaciones antes de sincronizar
    initModels();
    
    // force: false (por defecto) NO eliminará datos existentes
    // force: true eliminará y recreará las tablas (PELIGROSO - borra todos los datos)
    await sequelize.sync({ force });
    
    if (force) {
      logger.warn('⚠️ ADVERTENCIA: Base de datos recreada - Todos los datos anteriores fueron eliminados');
    } else {
      logger.info('✅ Modelos sincronizados con la base de datos (datos preservados)');
    }
    
    const allSchemas =  (await (sequelize as any).showAllSchemas()).map((el:any) => el.Tables_in_proyecto_integrador);
    logger.info(`Todos los Models(Tables) en la  Data Base ${process.env.DB_NAME}: ${allSchemas.join(', ')}`)
    logger.info('Modelos(Tablas) Data Base OK');
  } catch (error) {
    logger.error('❌ Error al sincronizar modelos:', error);
    throw error;
  }
};

// Función para inicializar relaciones entre modelos
export const initModels = () => {
  try {
    // Relación User -> Appointments (1:N)
    // Un usuario puede tener muchos turnos
    User.hasMany(Appointment, {
      foreignKey: 'idUser',
      as: 'appointments'
    });
    
    // Relación Appointment -> User (N:1)
    // Un turno pertenece a un usuario
    Appointment.belongsTo(User, {
      foreignKey: 'idUser',
      as: 'user'
    });

    // Relación Professional -> Services (1:N)
    // Un profesional puede tener muchos servicios
    Professional.hasMany(Service, {
      foreignKey: 'idProfessional',
      as: 'services'
    });
    
    // Relación Service -> Professional (N:1)
    // Un servicio pertenece a un profesional
    Service.belongsTo(Professional, {
      foreignKey: 'idProfessional',
      as: 'professional'
    });

    // Relación Service -> Appointments (1:N)
    // Un servicio puede tener muchos turnos
    Service.hasMany(Appointment, {
      foreignKey: 'idService',
      as: 'appointments'
    });
    
    // Relación Appointment -> Service (N:1)
    // Un turno está asociado a un servicio
    Appointment.belongsTo(Service, {
      foreignKey: 'idService',
      as: 'service'
    });

    logger.info('✅ Relaciones entre modelos inicializadas correctamente');
  } catch (error) {
    logger.error('❌ Error al inicializar relaciones entre modelos:', error);
    throw error;
  }
};
