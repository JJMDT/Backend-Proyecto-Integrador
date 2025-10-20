import * as appointmentRepository from '../repositories/appointmentRepository';
import { AppointmentInput } from '../interfaces/AppointmentInterface';
import { logger } from '../config/logger';

// Crear un nuevo turno
export const createAppointment = async (appointmentData: AppointmentInput) => {
  try {
    // Validar que la fecha sea futura
    const appointmentDate = new Date(appointmentData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      throw new Error('La fecha del turno debe ser futura');
    }

    // Verificar disponibilidad del horario
    const isAvailable = await appointmentRepository.checkTimeAvailability(
      appointmentData.date,
      appointmentData.time,
      appointmentData.idService
    );

    if (!isAvailable) {
      throw new Error('El horario seleccionado no está disponible');
    }

    // Crear el turno
    const newAppointment = await appointmentRepository.create(appointmentData);
    logger.info(`Turno creado exitosamente en service con ID: ${newAppointment.id}`);
    
    return newAppointment;
  } catch (error) {
    logger.error('Error al crear turno en service:', error);
    throw error;
  }
};

// Obtener todos los turnos
export const getAllAppointments = async () => {
  try {
    const appointments = await appointmentRepository.findAll();
    logger.info(`Service: Se obtuvieron ${appointments.length} turnos`);
    return appointments;
  } catch (error) {
    logger.error('Error al obtener turnos en service:', error);
    throw error;
  }
};

// Obtener turnos por usuario
export const getAppointmentsByUserId = async (idUser: string) => {
  try {
    if (!idUser) {
      throw new Error('El ID del usuario es requerido');
    }

    const appointments = await appointmentRepository.findByUserId(idUser);
    logger.info(`Service: Se obtuvieron ${appointments.length} turnos para el usuario ${idUser}`);
    return appointments;
  } catch (error) {
    logger.error(`Error al obtener turnos del usuario ${idUser} en service:`, error);
    throw error;
  }
};

// Obtener turno por ID
export const getAppointmentById = async (id: string) => {
  try {
    if (!id) {
      throw new Error('El ID del turno es requerido');
    }

    const appointment = await appointmentRepository.findById(id);
    
    if (!appointment) {
      throw new Error('Turno no encontrado');
    }

    logger.info(`Service: Turno obtenido exitosamente con ID: ${id}`);
    return appointment;
  } catch (error) {
    logger.error(`Error al obtener turno con ID ${id} en service:`, error);
    throw error;
  }
};

// Validar datos de entrada para crear turno
export const validateAppointmentInput = (appointmentData: any): appointmentData is AppointmentInput => {
  const requiredFields = ['idUser', 'idService', 'date', 'time', 'phone', 'petname'];
  
  for (const field of requiredFields) {
    if (!appointmentData[field]) {
      throw new Error(`El campo ${field} es requerido`);
    }
  }

  // Validar formato de hora
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(appointmentData.time)) {
    throw new Error('La hora debe tener formato HH:MM (ej: 09:30)');
  }

  // Validar longitud del teléfono
  if (appointmentData.phone.length < 8 || appointmentData.phone.length > 20) {
    throw new Error('El teléfono debe tener entre 8 y 20 caracteres');
  }

  // Validar longitud del nombre de mascota
  if (appointmentData.petname.length < 2 || appointmentData.petname.length > 100) {
    throw new Error('El nombre de la mascota debe tener entre 2 y 100 caracteres');
  }

  return true;
};