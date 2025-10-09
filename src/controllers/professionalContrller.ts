import { Request, Response } from "express";
import { logger } from "../config/logger";
import { ProfessionalCreate } from '../interfaces/ProfessionalInterface'
import { createProfessional, getAllProfessionals } from '../services/professionalService'

export const create = async (req: Request, res: Response): Promise<Response> => {
    try {
        const professionalData = req.body as ProfessionalCreate
        logger.info("Datos recibidos para crear un Professional ", professionalData)
        const newProfessional = await createProfessional(professionalData)
        const response = {
            status: 201,
            message: "Profesional creado de manera exitosa",
            data: newProfessional
        }
        logger.info("Professional creado exitosamente")
        return res.status(response.status).json(response)
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