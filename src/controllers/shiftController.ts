import { Request, Response } from 'express';
import * as shiftService from '../services/shiftService';
import { logger } from '../config/logger';

// Crear un nuevo turno CON QR y email
export const createShift = async (req: Request, res: Response) => {
  try {
    // Validar datos de entrada
    shiftService.validateShiftInput(req.body);

    // Crear el turno con QR y envío de email
    const result = await shiftService.createShiftWithQR(req.body);

    logger.info(`Controller: Turno creado exitosamente con ID: ${result.shift.id}`);
    
    res.status(201).json({
      status: 'success',
      message: 'Turno creado exitosamente. Se ha enviado un email de confirmación con el código QR.',
      data: {
        shift: result.shift,
        qrCode: result.qrCode,
        emailSent: result.emailSent
      }
    });
  } catch (error: any) {
    logger.error('Error en createShift controller:', error);
    
    // Manejo de errores específicos
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Error de validación',
        errors: error.errors.map((err: any) => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        status: 'error',
        message: 'El horario seleccionado ya está ocupado'
      });
    }

    res.status(400).json({
      status: 'error',
      message: error.message || 'Error al crear el turno'
    });
  }
};

// Obtener todos los turnos
export const getAllShifts = async (req: Request, res: Response) => {
  try {
    const shifts = await shiftService.getAllShifts();

    logger.info(`Controller: Se obtuvieron ${shifts.length} turnos`);
    
    res.status(200).json({
      status: 'success',
      message: 'Turnos obtenidos exitosamente',
      data: shifts,
      count: shifts.length
    });
  } catch (error: any) {
    logger.error('Error en getAllShifts controller:', error);
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error al obtener los turnos'
    });
  }
};

// Obtener turnos por usuario
export const getShiftsByUser = async (req: Request, res: Response) => {
  try {
    const { idUser } = req.params;

    if (!idUser) {
      return res.status(400).json({
        status: 'error',
        message: 'El ID del usuario es requerido'
      });
    }

    const shifts = await shiftService.getShiftsByUserId(idUser);

    logger.info(`Controller: Se obtuvieron ${shifts.length} turnos para el usuario ${idUser}`);
    
    res.status(200).json({
      status: 'success',
      message: 'Turnos del usuario obtenidos exitosamente',
      data: shifts,
      count: shifts.length
    });
  } catch (error: any) {
    logger.error(`Error en getShiftsByUser controller:`, error);
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error al obtener los turnos del usuario'
    });
  }
};

// Obtener turno por ID
export const getShiftById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'El ID del turno es requerido'
      });
    }

    const shift = await shiftService.getShiftById(id);

    logger.info(`Controller: Turno obtenido exitosamente con ID: ${id}`);
    
    res.status(200).json({
      status: 'success',
      message: 'Turno obtenido exitosamente',
      data: shift
    });
  } catch (error: any) {
    logger.error(`Error en getShiftById controller:`, error);
    
    if (error.message === 'Turno no encontrado') {
      return res.status(404).json({
        status: 'error',
        message: 'Turno no encontrado'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error al obtener el turno'
    });
  }
};

// Obtener turnos por profesional
export const getShiftsByProfessional = async (req: Request, res: Response) => {
  try {
    const { idProfessional } = req.params;

    if (!idProfessional) {
      return res.status(400).json({
        status: 'error',
        message: 'El ID del profesional es requerido'
      });
    }

    const shifts = await shiftService.getShiftsByProfessionalId(idProfessional);

    logger.info(`Controller: Se obtuvieron ${shifts.length} turnos para el profesional ${idProfessional}`);
    
    res.status(200).json({
      status: 'success',
      message: 'Turnos del profesional obtenidos exitosamente',
      data: shifts,
      count: shifts.length
    });
  } catch (error: any) {
    logger.error(`Error en getShiftsByProfessional controller:`, error);
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error al obtener los turnos del profesional'
    });
  }
};
