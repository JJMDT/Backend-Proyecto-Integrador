////Aca va estar la comounicacion con el model de la base de datos
import { Professional } from '../models/professionalModel';
import Service from '../models/serviceModel';
import { ProfessionalCreate } from '../interfaces/ProfessionalInterface';

export const create = async (professionalData: ProfessionalCreate) => {
    return await Professional.create(professionalData);
};

export const findAll = async () => {
    return await Professional.findAll();
};

export const findAllWithServices = async () => {
    return await Professional.findAll({
        include: [
            {
                model: Service,
                as: 'services',
                attributes: ['id', 'name', 'description', 'price', 'createdAt', 'updatedAt']
            }
        ],
        attributes: { exclude: ['password'] } // Excluir la contraseña por seguridad
    });
};