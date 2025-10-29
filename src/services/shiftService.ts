import * as shiftRepository from '../repositories/shiftRepository';
import { ShiftInput } from '../interfaces/ShiftInterface';
import { logger } from '../config/logger';

// Crear un nuevo turno
export const createShift = async (shiftData: ShiftInput) => {
  try {
    // Validar que la fecha sea futura
    const shiftDate = new Date(shiftData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (shiftDate < today) {
      throw new Error('La fecha del turno debe ser futura');
    }

    // Verificar disponibilidad del horario
    const isAvailable = await shiftRepository.checkTimeAvailability(
      shiftData.date,
      shiftData.time,
      shiftData.idService
    );

    if (!isAvailable) {
      throw new Error('El horario seleccionado no está disponible');
    }

    // Crear el turno
    const newShift = await shiftRepository.create(shiftData);
    logger.info(`Turno creado exitosamente en service con ID: ${newShift.id}`);
    
    return newShift;
  } catch (error) {
    logger.error('Error al crear turno en service:', error);
    throw error;
  }
};

// Obtener todos los turnos
export const getAllShifts = async () => {
  try {
    const shifts = await shiftRepository.findAll();
    logger.info(`Service: Se obtuvieron ${shifts.length} turnos`);
    return shifts;
  } catch (error) {
    logger.error('Error al obtener turnos en service:', error);
    throw error;
  }
};

// Obtener turnos por usuario
export const getShiftsByUserId = async (idUser: string) => {
  try {
    if (!idUser) {
      throw new Error('El ID del usuario es requerido');
    }

    const shifts = await shiftRepository.findByUserId(idUser);
    logger.info(`Service: Se obtuvieron ${shifts.length} turnos para el usuario ${idUser}`);
    return shifts;
  } catch (error) {
    logger.error(`Error al obtener turnos del usuario ${idUser} en service:`, error);
    throw error;
  }
};

// Obtener turno por ID
export const getShiftById = async (id: string) => {
  try {
    if (!id) {
      throw new Error('El ID del turno es requerido');
    }

    const shift = await shiftRepository.findById(id);
    
    if (!shift) {
      throw new Error('Turno no encontrado');
    }

    logger.info(`Service: Turno obtenido exitosamente con ID: ${id}`);
    return shift;
  } catch (error) {
    logger.error(`Error al obtener turno con ID ${id} en service:`, error);
    throw error;
  }
};

// Validar datos de entrada para crear turno
export const validateShiftInput = (shiftData: any): shiftData is ShiftInput => {
  const requiredFields = ['idUser', 'idService', 'date', 'time', 'phone', 'petname'];
  
  for (const field of requiredFields) {
    if (!shiftData[field]) {
      throw new Error(`El campo ${field} es requerido`);
    }
  }

  // Validar formato de hora
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(shiftData.time)) {
    throw new Error('La hora debe tener formato HH:MM (ej: 09:30)');
  }

  // Validar longitud del teléfono
  if (shiftData.phone.length < 8 || shiftData.phone.length > 20) {
    throw new Error('El teléfono debe tener entre 8 y 20 caracteres');
  }

  // Validar longitud del nombre de mascota
  if (shiftData.petname.length < 2 || shiftData.petname.length > 100) {
    throw new Error('El nombre de la mascota debe tener entre 2 y 100 caracteres');
  }

  return true;
};
