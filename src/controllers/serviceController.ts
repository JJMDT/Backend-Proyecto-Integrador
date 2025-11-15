import { createService as createServiceService, getAllServices as getAllServicesService } from "../services/serviceService";
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