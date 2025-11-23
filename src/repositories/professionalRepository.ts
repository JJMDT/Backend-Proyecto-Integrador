////Aca va estar la comounicacion con el model de la base de datos
import { Professional } from '../models/professionalModel';
import Service from '../models/serviceModel';
import { ProfessionalCreate } from '../interfaces/ProfessionalInterface';

export const create = async (professionalData: ProfessionalCreate) => {
    return await Professional.create(professionalData);
};

export const findAll = async () => {
    return await Professional.findAll({
        where: {
            active: true
        }
    });
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
         where: {
            active: true
        }
    });
};

// mostrar la informacion de un profesional en especifico junto con sus servicios
export const findProfessionalWithServices = async (professionalId: string) => {
    return await Professional.findByPk(professionalId, {
        
        include: [
            {
                model: Service,
                as: 'services',
                attributes: ['id', 'name', 'description', 'price', 'createdAt', 'updatedAt']
            }
        ],        
    });
};

export const findByEmail = async (emailData: string) => {
    const findProfessional = await Professional.findOne({
        where: {
            email: emailData
        }
    });
    return findProfessional;
}
