import { createUser as createUserService, getAllUsers as getAllUsersService } from "../services/userService";
import { Request, Response } from "express";
import { logger } from "../config/logger";
import { UserInput } from '../interfaces/UserInterface'
import bcrypt from 'bcrypt'
import { emailTemplates, sendEmail } from '../services/emailService'

// Función para crear un nuevo usuario
export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userData = req.body as UserInput;
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
        // Log para debug - ver qué datos llegan
        logger.info('Datos recibidos para crear usuario:', userData);
        const newUser = await createUserService(userData);
        const { welcome } = emailTemplates
        const emailWelcome =  welcome(`${userData.name} ${userData.lastname}`);
        await sendEmail(userData.email , emailWelcome.subject , emailWelcome.html);
        const response = {
            status: "success 201",
            message: "Usuario creado de manera exitosa",
            data: newUser
        }
        return res.status(201).json(response);
    } catch (error: any) {
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