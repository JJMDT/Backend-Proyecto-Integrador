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