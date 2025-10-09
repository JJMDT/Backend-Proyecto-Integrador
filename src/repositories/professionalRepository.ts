////Aca va estar la comounicacion con el model de la base de datos
import { Professional } from '../models/professionalModel';
import { ProfessionalCreate } from '../interfaces/ProfessionalInterface';

export const create = async (professionalData: ProfessionalCreate) => {
    return await Professional.create(professionalData);
};

export const findAll = async () => {
    return await Professional.findAll();
};