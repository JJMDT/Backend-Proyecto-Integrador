import Shift from '../models/shiftModel';
import User from '../models/userModel';
import Service from '../models/serviceModel';
import Professional from '../models/professionalModel';
import { ShiftInput } from '../interfaces/ShiftInterface';
import { logger } from '../config/logger';

// Crear un nuevo turno
export const create = async (shiftData: ShiftInput) => {
  try {
    const shift = await Shift.create(shiftData);
    logger.info(`Turno creado exitosamente con ID: ${shift.id}`);
    return shift;
  } catch (error) {
    logger.error('Error al crear turno en repository:', error);
    throw error;
  }
};

// Obtener todos los turnos
export const findAll = async () => {
  try {
    const shifts = await Shift.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'lastname', 'email']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'description', 'price'],
          include: [
            {
              model: Professional,
              as: 'professional',
              attributes: ['id', 'name', 'lastname', 'specialty', 'nameEstablishment']
            }
          ]
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    
    logger.info(`Se encontraron ${shifts.length} turnos`);
    return shifts;
  } catch (error) {
    logger.error('Error al obtener turnos en repository:', error);
    throw error;
  }
};

// Obtener turnos por usuario
export const findByUserId = async (idUser: string) => {
  try {
    const shifts = await Shift.findAll({
      where: { idUser },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'lastname', 'email']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'description', 'price'],
          include: [
            {
              model: Professional,
              as: 'professional',
              attributes: ['id', 'name', 'lastname', 'specialty', 'nameEstablishment']
            }
          ]
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    
    logger.info(`Se encontraron ${shifts.length} turnos para el usuario ${idUser}`);
    return shifts;
  } catch (error) {
    logger.error(`Error al obtener turnos del usuario ${idUser} en repository:`, error);
    throw error;
  }
};

// Obtener turno por ID
export const findById = async (id: string) => {
  try {
    const shift = await Shift.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'lastname', 'email']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'description', 'price'],
          include: [
            {
              model: Professional,
              as: 'professional',
              attributes: ['id', 'name', 'lastname', 'specialty', 'nameEstablishment' , 'email']
            }
          ]
        }
      ]
    });
    
    if (shift) {
      logger.info(`Turno encontrado con ID: ${id}`);
    } else {
      logger.warn(`No se encontró turno con ID: ${id}`);
    }
    
    return shift;
  } catch (error) {
    logger.error(`Error al obtener turno con ID ${id} en repository:`, error);
    throw error;
  }
};

// Verificar disponibilidad de horario
export const checkTimeAvailability = async (date: Date, time: string, idService: string) => {
  try {
    const existingShift = await Shift.findOne({
      where: {
        date,
        time,
        idService
      }
    });
    
    const isAvailable = !existingShift;
    logger.info(`Verificación de disponibilidad para ${date} ${time}: ${isAvailable ? 'Disponible' : 'No disponible'}`);
    
    return isAvailable;
  } catch (error) {
    logger.error('Error al verificar disponibilidad en repository:', error);
    throw error;
  }
};

// Obtener turnos ocupados por fecha y servicio
export const findByDateAndService = async (date: Date, idService: string) => {
  try {
    const shifts = await Shift.findAll({
      where: {
        date,
        idService
      },
      attributes: ['time'],
      order: [['time', 'ASC']]
    });
    
    logger.info(`Se encontraron ${shifts.length} turnos para la fecha ${date} y servicio ${idService}`);
    return shifts;
  } catch (error) {
    logger.error('Error al obtener turnos por fecha y servicio:', error);
    throw error;
  }
};

// Obtener turnos por profesional
export const findByProfessionalId = async (idProfessional: string) => {
  try {
    const shifts = await Shift.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'lastname', 'email']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'description', 'price'],
          where: { idProfessional },
          include: [
            {
              model: Professional,
              as: 'professional',
              attributes: ['id', 'name', 'lastname', 'specialty', 'nameEstablishment']
            }
          ]
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    
    logger.info(`Se encontraron ${shifts.length} turnos para el profesional ${idProfessional}`);
    return shifts;
  } catch (error) {
    logger.error(`Error al obtener turnos del profesional ${idProfessional} en repository:`, error);
    throw error;
  }
};
