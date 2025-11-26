import  Service  from "../models/serviceModel";
import { ServiceInput } from "../interfaces/ServiceInterface";

// Función para crear un nuevo servicio
export const create = async (service: ServiceInput) => {
    return await Service.create(service);
};
// Función para obtener todos los servicios
export const findAll = async () => {
    return await Service.findAll();
};

// Función para obtener un servicio por ID
export const findById = async (id: string) => {
    return await Service.findByPk(id);
};

// Función para eliminar un servicio por ID
export const deleteById = async (id: string) => {
    const service = await Service.findByPk(id);
    if (!service) {
        return null;
    }
    await service.destroy();
    return service;
};