import * as shiftRepository from '../repositories/shiftRepository';
import { ShiftInput } from '../interfaces/ShiftInterface';
import { logger } from '../config/logger';
import { generateQRCode, QRShiftData } from './qrService';
import { sendEmail, sendEmailWithAttachments, emailTemplates, TurnoConfirmadoData } from './emailService';

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

/**
 * Crear turno con generación de QR y envío de email de confirmación
 * @param shiftData - Datos del turno a crear
 * @returns Turno creado con QR generado
 */
export const createShiftWithQR = async (shiftData: ShiftInput) => {
  try {
    // Crear el turno
    const newShift = await createShift(shiftData);
    
    // Obtener el turno completo con todas las relaciones (user, service, professional)
    const shiftComplete: any = await shiftRepository.findById(newShift.id);
    
    if (!shiftComplete) {
      throw new Error('No se pudo obtener la información completa del turno');
    }

    // Extraer datos con validación
    const user = shiftComplete.user;
    const service = shiftComplete.service;
    
    if (!user || !service) {
      throw new Error('Información del usuario o servicio no disponible');
    }

    const professional = service.professional;
    
    if (!professional) {
      throw new Error('Información del profesional no disponible');
    }

    // Preparar datos para el QR
    const qrData: QRShiftData = {
      idTurno: shiftComplete.id,
      date: new Date(shiftComplete.date).toISOString().split('T')[0],
      time: shiftComplete.time,
      petName: shiftComplete.petname,
      service: {
        name: service.name,
        price: service.price,
        description: service.description
      },
      professional: {
        name: professional.name,
        lastname: professional.lastname,
        specialty: professional.specialty,
        nameEstablishment: professional.nameEstablishment
      },
      usuario: {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        phone: shiftComplete.phone
      }
    };

    // Generar código QR
    const qrCodeImage = await generateQRCode(qrData);
    logger.info(`QR generado para el turno ${shiftComplete.id}`);

    // Preparar datos para el email
    const emailData: TurnoConfirmadoData = {
      userName: `${user.name} ${user.lastname}`,
      date: new Date(shiftComplete.date).toLocaleDateString('es-AR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: shiftComplete.time,
      petName: shiftComplete.petname,
      serviceName: service.name,
      servicePrice: service.price,
      professionalName: `${professional.name} ${professional.lastname}`,
      establishmentName: professional.nameEstablishment,
      qrCodeImage: qrCodeImage
    };

    // Enviar email de confirmación (usar attachment inline via cid para compatibilidad)
    const emailTemplate = emailTemplates.turnoconfirmado(emailData);

    // Extraer base64 si qrCodeImage es data URL
    let attachments: any[] | undefined = undefined;
    if (qrCodeImage && typeof qrCodeImage === 'string' && qrCodeImage.startsWith('data:')) {
      const parts = qrCodeImage.split(',');
      const base64 = parts[1];
      const buffer = Buffer.from(base64, 'base64');
      attachments = [
        {
          filename: `qr-${shiftComplete.id}.png`,
          content: buffer,
          cid: 'qr@turno' // debe coincidir con el src cid en el template
        }
      ];
    }

    // Usar la función que admite attachments si existen
    let emailSent: boolean;
    if (attachments) {
      emailSent = await sendEmailWithAttachments(user.email, emailTemplate.subject, emailTemplate.html, attachments);
    } else {
      emailSent = await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);
    }
    
    if (emailSent) {
      logger.info(`Email de confirmación enviado a ${user.email}`);
    } else {
      logger.warn(`No se pudo enviar el email de confirmación a ${user.email}`);
    }

    // Retornar turno con QR
    return {
      shift: shiftComplete,
      qrCode: qrCodeImage,
      emailSent: emailSent
    };
    
  } catch (error) {
    logger.error('Error al crear turno con QR:', error);
    throw error;
  }
};

/**
 * Obtener horarios disponibles para una fecha y servicio específico
 * @param date - Fecha en formato YYYY-MM-DD
 * @param idService - ID del servicio
 * @returns Array de horarios disponibles
 */
export const getAvailableHours = async (date: string, idService: string) => {
  try {
    // Convertir string a Date
    const dateObj = new Date(date);
    
    // Obtener turnos ocupados para esa fecha y servicio
    const occupiedShifts = await shiftRepository.findByDateAndService(dateObj, idService);
    const occupiedTimes = occupiedShifts.map((shift: any) => shift.time);
    
    // Definir horarios de trabajo (de 9:00 a 18:00, cada 30 minutos)
    const workHours = [];
    for (let hour = 9; hour < 18; hour++) {
      workHours.push(`${hour.toString().padStart(2, '0')}:00`);
      workHours.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    // Filtrar horarios disponibles
    const availableHours = workHours.filter(time => !occupiedTimes.includes(time));
    
    logger.info(`Horarios disponibles para ${date} - Servicio ${idService}: ${availableHours.length} slots`);
    
    return availableHours;
  } catch (error) {
    logger.error('Error al obtener horarios disponibles:', error);
    throw error;
  }
};
