//Contiene la lógica de negocio (qué hay que hacer, cómo combinar los datos)
import { ProfessionalCreate } from '../interfaces/ProfessionalInterface';
import { create, findAll } from '../repositories/professionalRepository'

//falta manejar los posibles errores
export const createProfessional = async (professionalData: ProfessionalCreate) => {
    const newProfessional = await create(professionalData);
    return newProfessional
}

export const getAllProfessionals = async () =>{
    const professionals = await findAll();
    return professionals;
}
