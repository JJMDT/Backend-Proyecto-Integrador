//Contiene la lógica de negocio (qué hay que hacer, cómo combinar los datos)
import { ProfessionalCreate } from '../interfaces/ProfessionalInterface';
import {
    create,
    findAll,
    findAllWithServices,
    findProfessionalWithServices,
    findByEmail
} from '../repositories/professionalRepository'

//falta manejar los posibles errores
export const createProfessional = async (professionalData: ProfessionalCreate) => {
    const newProfessional = await create(professionalData);
    return newProfessional
}

export const getAllProfessionals = async () => {
    const professionals = await findAll();
    return professionals;
}

export const getAllProfessionalsWithServices = async () => {
    const professionals = await findAllWithServices();
    return professionals;
}

// mostrar la informacion de un profesional en especifico junto con sus servicios
export const getProfessionalWithServices = async (professionalId: string) => {
    const professional = await findProfessionalWithServices(professionalId);
    return professional;
}

export const findProfessionalbyEmail = async (emailData: string) => {
    const findProfessional = await findByEmail(emailData);
    if (!findProfessional) {
        const error = new Error("No se encontro el Profesional con ese email");
        throw error
    }
    return findProfessional
}