import { Request, Response } from "express";
import { logger } from "../config/logger";
import { ProfessionalCreate } from '../interfaces/ProfessionalInterface'
import {
    createProfessional,
    getAllProfessionals,
    getAllProfessionalsWithServices,
    getProfessionalWithServices
} from '../services/professionalService';
import { emailTemplates, sendEmail } from '../services/emailService';
import bcrypt from 'bcrypt'

export const create = async (req: Request, res: Response): Promise<Response> => {
    try {
        const professionalData = req.body as ProfessionalCreate
        const hashedPassword = await bcrypt.hash(professionalData.password, 10);
        professionalData.password = hashedPassword;
        logger.info("Datos recibidos para crear un Professional ", professionalData)
        const newProfessional = await createProfessional(professionalData)
        const { welcome } = emailTemplates
        const emailWelcome = welcome(`${newProfessional.name} ${newProfessional.lastname}`);
        await sendEmail(newProfessional.email, emailWelcome.subject, emailWelcome.html);
        const response = {
            status: "success 201",
            message: "Profesional creado de manera exitosa",
            data: newProfessional
        }
        logger.info("Professional creado exitosamente")
        return res.status(201).json(response)
    } catch (error) {
        logger.error(error)
        return res.status(400).json(error)
    }
};

export const getAll = async (req: Request, res: Response): Promise<Response> => {
    logger.info("Recibiendo la peticion para mostrar  todos los Professionals ")
    try {
        const professionals = await getAllProfessionals();
        const response = {
            status: 200,
            message: "Motrando todos los profesionales",
            data: professionals
        }
        return res.status(response.status).json(response)
    } catch (error) {
        logger.error(error);
        return res.status(400).json(error)
    }
}

export const getAllWithServices = async (req: Request, res: Response): Promise<Response> => {
    logger.info("Recibiendo la petición para mostrar todos los Profesionales con sus Servicios")
    try {
        const professionals = await getAllProfessionalsWithServices();
        const response = {
            status: 200,
            message: "Mostrando todos los profesionales con sus servicios",
            data: professionals
        }
        logger.info(`Se encontraron ${professionals.length} profesionales con servicios`)
        return res.status(response.status).json(response)
    } catch (error) {
        logger.error("Error al obtener profesionales con servicios:", error);
        return res.status(400).json({
            status: 400,
            message: "Error al obtener profesionales con servicios",
            error: error
        })
    }
}

// mostrar la informacion de un profesional en especifico junto con sus servicios
export const getOneWithServices = async (req: Request, res: Response): Promise<Response> => {
    const professionalId = req.params.id;
    logger.info(`Recibiendo la petición para mostrar el profesional con ID ${professionalId} y sus servicios`);
    try {
        const professional = await getProfessionalWithServices(professionalId);
        if (!professional) {
            logger.warn(`Profesional con ID ${professionalId} no encontrado`);
            return res.status(404).json({
                status: 404,
                message: `Profesional con ID ${professionalId} no encontrado`
            });
        }
        const response = {
            status: 200,
            message: `Mostrando profesional con ID ${professionalId} y sus servicios`,
            data: professional
        };
        logger.info(`Profesional con ID ${professionalId} encontrado exitosamente`);
        return res.status(response.status).json(response);
    } catch (error) {
        logger.error(`Error al obtener profesional con ID ${professionalId} y sus servicios:`, error);
        return res.status(400).json({
            status: 400,
            message: `Error al obtener profesional con ID ${professionalId} y sus servicios`,
            error: error
        });
    }
};

export const updateProfessional = async (req: Request, res: Response): Promise<Response> => {
    const professionalId = req.params.id;
    logger.info(`Recibiendo la petición para editar  el profesional con ID ${professionalId}`);
    try {
        const professional = await getProfessionalWithServices(professionalId);
        if (!professional) {
            logger.warn(`Profesional con ID ${professionalId} no encontrado`);
            const error = new Error(`Profesional con ID ${professionalId} no encontrado`);
            error.name = "404"
            throw error
        }
        professional.set(req.body); // modifico lo que viene por body
        professional.active = true;
        await professional.save(); // lo guardo en la DB
        const response = {
            status: 200,
            message: `Mostrando profesional con ID ${professionalId} y sus servicios`,
            data: professional
        };
        const { professionalProfileUpdate } = emailTemplates;
        const emailWelcome = professionalProfileUpdate(`${professional.name} ${professional.lastname}`);
        await sendEmail(professional.email, emailWelcome.subject, emailWelcome.html);
        logger.info(`Profesional con ID ${professionalId}, editado exitosamente`)
        return res.status(response.status).json(response);
    } catch (error: any) {
        logger.error(`Error al obtener profesional con ID ${professionalId} y sus servicios:`, error);
        if (error.name === '404') {
            return res.status(Number(error.name)).json({
                status: Number(error.name),
                message: error.message,
                error: error
            });
        }
        return res.status(400).json({
            status: 400,
            message: error.message,
            error: error
        });
    }
}