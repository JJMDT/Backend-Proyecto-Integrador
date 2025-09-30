import { createUser as createUserService, getAllUsers as getAllUsersService } from "../services/userService";
import { Request, Response } from "express";
import { logger } from "../config/logger";

// Función para crear un nuevo usuario
export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userData = req.body;
        
        // Log para debug - ver qué datos llegan
        logger.info('Datos recibidos para crear usuario:', userData);
        
        const newUser = await createUserService(userData);
        return res.status(201).json(newUser);
    } catch (error: unknown) {
        logger.error('Error al crear usuario:', error);
        
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

// Función para obtener todos los usuarios
export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const users = await getAllUsersService();
        return res.status(200).json(users);
    } catch (error: unknown) {
        logger.error('Error al obtener usuarios:', error);
        
        return res.status(500).json({ 
            message: 'Error al obtener los usuarios'
        });
    }
};