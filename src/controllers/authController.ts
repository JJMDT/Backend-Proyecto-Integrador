import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { UserLogin, UserResponse } from '../interfaces/UserInterface'
import { findUserByEmail } from '../services/userService'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
import { logger } from "../config/logger";
import { findProfessionalbyEmail } from '../services/professionalService';
import { IProfessionalLogin, IProfessional } from '../interfaces/index'

dotenv.config();

interface ITokenRequest extends Request {
    user?: any
}

interface IUserPayload extends Partial<UserResponse> { }

interface IProfessionalPayload extends Partial<IProfessional> { }


export const login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body as UserLogin;
    if (!email || !password) {
        return res.status(400).json({ status: 'error 400', message: 'Email y contraseña son obligatorios' });
    }
    try {
        const user = await findUserByEmail(email);
        const validarPassword = await bcrypt.compare(password, user.password);
        if (!validarPassword) {
            logger.error("Error a iniciar sesion , contraseña incorrecta")
            return res.status(401).json({ status: 'error 401', message: 'Contraseña incorrecta' });
        }
        //generamos el token
        const userPayload: IUserPayload = {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            dni: user.dni,
            email: user.email,
            rol: user.rol
        }
        const token = jwt.sign(userPayload,
            process.env.JWT_SECRET as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN as any
            }
        )
        const response = {
            status: 'success 200',
            message: 'Inicio de sesión exitoso',
            data: {
                user,
                token
            }
        }
        return res.status(200).json(response);
    }
    catch (error: any) {
        logger.error(error)
        const response = {
            status: 'Error 500',
            message: error.message,
        }
        return res.status(500).json(response);
    }
}

export const profileUser = async (req: ITokenRequest, res: Response) => {
    try {
        const response = {
            status: "success 200",
            message: "Mostrando informacion usuario/profesional logueado",
            data: req.user
        }
        return res.status(200).json(response)
    } catch (error: any) {
        logger.error(error)
        const response = {
            status: 'Error 500',
            message: error.message,
        }
        return res.status(500).json(response);
    }
}

export const logingProfessional = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body as IProfessionalLogin;
    if (!email || !password) {
        return res.status(400).json({ status: 'error 400', message: 'Email y contraseña son obligatorios' });
    }
    try {
        const profesional = await findProfessionalbyEmail(email);
        const validarPassword = await bcrypt.compare(password, profesional.password);
        if (!validarPassword) {
            logger.error("Error a iniciar sesion , contraseña incorrecta")
            return res.status(401).json({ status: 'error 401', message: 'Contraseña incorrecta' });
        }
        //generamos el token
        const profesionalPayload: IProfessionalPayload = {
            id: profesional.id,
            name: profesional.name,
            lastname: profesional.lastname,
            dni: profesional.dni,
            email: profesional.email,
            license: profesional.license,
            specialty: profesional.specialty
        }
        const token = jwt.sign(profesionalPayload,
            process.env.JWT_SECRET as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN as any
            }
        )
        const response = {
            status: 'success 200',
            message: 'Inicio de sesión exitoso',
            data: {
                profesionalPayload,
                token
            }
        }
        return res.status(200).json(response);
    }
    catch (error: any) {
        logger.error(error)
        const response = {
            status: 'Error 500',
            message: error.message,
        }
        return res.status(500).json(response);
    }
}