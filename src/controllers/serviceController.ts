import { createService as createServiceService, getAllServices as getAllServicesService, deleteService as deleteServiceService, deleteProfessionalService } from "../services/serviceService";
import { Request, Response } from "express";
import { logger } from "../config/logger"; 
//Función para crear un nuevo servicio
export const createService = async (req: Request, res:Response): Promise<Response> => {
    try {
        const serviceData = req.body;

        // Log para debug - ver qué datos llegan
        logger.info( 'Datos recibidos para crear servicio:', serviceData);

        const newService = await createServiceService(serviceData);
        //qr -- generar código QR
        // envio de email con el qr adjunto
        return res.status(201).json(newService);
    } catch (error: unknown) {
        logger.error('Error al crear servicio:', error);

        // Si es error de validación de Sequelize
        if (error && typeof error === 'object' && 'name' in error && error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: 'Error de validación en los datos enviados'
            });
        }

        // Error genérico
        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
};

// Función para obtener todos los servicios
export const getAllServices = async (req: Request, res: Response): Promise<Response> => {
    try {
        const services = await getAllServicesService();
        return res.status(200).json(services);
    } catch (error: unknown) {
        logger.error('Error al obtener servicios:', error);

        return res.status(500).json({
            message: 'Error al obtener los servicios'
        });
    }
};

// Función para eliminar un servicio por ID
export const deleteService = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id, serviceId } = req.params;
        const serviceIdToDelete = serviceId || id; // Usar serviceId si viene de ruta anidada, sino usar id
        
        logger.info(`Intentando eliminar servicio con ID: ${serviceIdToDelete}`);
        
        const deletedService = await deleteServiceService(serviceIdToDelete);
        
        if (!deletedService) {
            logger.warn(`Servicio con ID ${serviceIdToDelete} no encontrado`);
            return res.status(404).json({
                message: 'Servicio no encontrado'
            });
        }
        
        logger.info(`Servicio con ID ${serviceIdToDelete} eliminado exitosamente`);
        
        return res.status(200).json({
            message: 'Servicio eliminado exitosamente',
            data: deletedService
        });
        
    } catch (error: unknown) {
        logger.error('Error al eliminar servicio:', error);
        
        return res.status(500).json({
            message: 'Error interno del servidor al eliminar el servicio'
        });
    }
};

// Función para que un profesional elimine uno de sus servicios (con validación de permisos)
export const deleteProfessionalServiceController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { professionalId, serviceId } = req.params;
        
        logger.info(`Profesional ${professionalId} intentando eliminar servicio ${serviceId}`);
        
        const deletedService = await deleteProfessionalService(professionalId, serviceId);
        
        if (!deletedService) {
            logger.warn(`Servicio con ID ${serviceId} no encontrado`);
            return res.status(404).json({
                message: 'Servicio no encontrado'
            });
        }
        
        logger.info(`Servicio ${serviceId} eliminado exitosamente por profesional ${professionalId}`);
        
        return res.status(200).json({
            message: 'Servicio eliminado exitosamente',
            data: deletedService
        });
        
    } catch (error: unknown) {
        logger.error('Error al eliminar servicio:', error);
        
        if (error instanceof Error && error.message === 'No tienes permisos para eliminar este servicio') {
            return res.status(403).json({
                message: 'No tienes permisos para eliminar este servicio'
            });
        }
        
        return res.status(500).json({
            message: 'Error interno del servidor al eliminar el servicio'
        });
    }
};