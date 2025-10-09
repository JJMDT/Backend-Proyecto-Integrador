import { create, findAll } from "../repositories/serviceRepository";
import { ServiceInput } from "../interfaces/ServiceInterface";

// Funcion para crear un nuevo servicio
export const createService = async (serviceData: ServiceInput) => {
    const newService = await create(serviceData);
    return newService;
};

//Función para obtener todos los servicios
export const getAllServices = async () => {
    const services = await findAll();
    return services;
};