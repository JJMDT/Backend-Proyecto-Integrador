import Appointment from '../models/appointmentModel';
import User from '../models/userModel';
import Service from '../models/serviceModel';
import Professional from '../models/professionalModel';
import { AppointmentInput } from '../interfaces/AppointmentInterface';
import { logger } from '../config/logger';

// Crear un nuevo turno
export const create = async (appointmentData: AppointmentInput) => {
  try {
    const appointment = await Appointment.create(appointmentData);
    logger.info(`Turno creado exitosamente con ID: ${appointment.id}`);
    return appointment;
  } catch (error) {
    logger.error('Error al crear turno en repository:', error);
    throw error;
  }
};

// Obtener todos los turnos
export const findAll = async () => {
  try {
    const appointments = await Appointment.findAll({
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
    
    logger.info(`Se encontraron ${appointments.length} turnos`);
    return appointments;
  } catch (error) {
    logger.error('Error al obtener turnos en repository:', error);
    throw error;
  }
};

// Obtener turnos por usuario
export const findByUserId = async (idUser: string) => {
  try {
    const appointments = await Appointment.findAll({
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
    
    logger.info(`Se encontraron ${appointments.length} turnos para el usuario ${idUser}`);
    return appointments;
  } catch (error) {
    logger.error(`Error al obtener turnos del usuario ${idUser} en repository:`, error);
    throw error;
  }
};

// Obtener turno por ID
export const findById = async (id: string) => {
  try {
    const appointment = await Appointment.findByPk(id, {
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
      ]
    });
    
    if (appointment) {
      logger.info(`Turno encontrado con ID: ${id}`);
    } else {
      logger.warn(`No se encontró turno con ID: ${id}`);
    }
    
    return appointment;
  } catch (error) {
    logger.error(`Error al obtener turno con ID ${id} en repository:`, error);
    throw error;
  }
};

// Verificar disponibilidad de horario
export const checkTimeAvailability = async (date: Date, time: string, idService: string) => {
  try {
    const existingAppointment = await Appointment.findOne({
      where: {
        date,
        time,
        idService
      }
    });
    
    const isAvailable = !existingAppointment;
    logger.info(`Verificación de disponibilidad para ${date} ${time}: ${isAvailable ? 'Disponible' : 'No disponible'}`);
    
    return isAvailable;
  } catch (error) {
    logger.error('Error al verificar disponibilidad en repository:', error);
    throw error;
  }
};