import { UserService } from "../services/userService";
import { Request, Response } from "express";
import { logger } from "../config/logger";

const userService = new UserService();

export class UserController {
    // Controlador para crear un nuevo usuario
    async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const userData = req.body;
            
            // Log para debug - ver qué datos llegan
            logger.info('Datos recibidos para crear usuario:', userData);
            
            const newUser = await userService.createUser(userData);
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
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return res.status(500).json({ 
                message: 'Error interno del servidor'
            });
        }
    }

    // Controlador para obtener todos los usuarios
    async getAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await userService.getAllUsers();
            return res.status(200).json(users);
        } catch (error: unknown) {
            logger.error('Error al obtener usuarios:', error);
            
            return res.status(500).json({ 
                message: 'Error al obtener los usuarios'
            });
        }
    }
}