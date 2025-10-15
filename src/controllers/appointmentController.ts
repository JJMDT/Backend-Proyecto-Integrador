import { Request, Response } from 'express';
import * as appointmentService from '../services/appointmentService';
import { logger } from '../config/logger';

// Crear un nuevo turno
export const createAppointment = async (req: Request, res: Response) => {
  try {
    // Validar datos de entrada
    appointmentService.validateAppointmentInput(req.body);

    // Crear el turno
    const newAppointment = await appointmentService.createAppointment(req.body);

    logger.info(`Controller: Turno creado exitosamente con ID: ${newAppointment.id}`);
    
    res.status(201).json({
      status: 'success',
      message: 'Turno creado exitosamente',
      data: newAppointment
    });
  } catch (error: any) {
    logger.error('Error en createAppointment controller:', error);
    
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
export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await appointmentService.getAllAppointments();

    logger.info(`Controller: Se obtuvieron ${appointments.length} turnos`);
    
    res.status(200).json({
      status: 'success',
      message: 'Turnos obtenidos exitosamente',
      data: appointments,
      count: appointments.length
    });
  } catch (error: any) {
    logger.error('Error en getAllAppointments controller:', error);
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error al obtener los turnos'
    });
  }
};

// Obtener turnos por usuario
export const getAppointmentsByUser = async (req: Request, res: Response) => {
  try {
    const { idUser } = req.params;

    if (!idUser) {
      return res.status(400).json({
        status: 'error',
        message: 'El ID del usuario es requerido'
      });
    }

    const appointments = await appointmentService.getAppointmentsByUserId(idUser);

    logger.info(`Controller: Se obtuvieron ${appointments.length} turnos para el usuario ${idUser}`);
    
    res.status(200).json({
      status: 'success',
      message: 'Turnos del usuario obtenidos exitosamente',
      data: appointments,
      count: appointments.length
    });
  } catch (error: any) {
    logger.error(`Error en getAppointmentsByUser controller:`, error);
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error al obtener los turnos del usuario'
    });
  }
};

// Obtener turno por ID
export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'El ID del turno es requerido'
      });
    }

    const appointment = await appointmentService.getAppointmentById(id);

    logger.info(`Controller: Turno obtenido exitosamente con ID: ${id}`);
    
    res.status(200).json({
      status: 'success',
      message: 'Turno obtenido exitosamente',
      data: appointment
    });
  } catch (error: any) {
    logger.error(`Error en getAppointmentById controller:`, error);
    
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