import { create, findAll, findById, deleteById } from "../repositories/serviceRepository";
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

//Función para obtener un servicio por ID
export const getServiceById = async (id: string) => {
    const service = await findById(id);
    return service;
};

//Función para eliminar un servicio por ID
export const deleteService = async (id: string) => {
    const deletedService = await deleteById(id);
    return deletedService;
};

//Función para eliminar un servicio verificando que pertenece al profesional
export const deleteProfessionalService = async (professionalId: string, serviceId: string) => {
    // Primero verificar que el servicio existe y pertenece al profesional
    const service = await findById(serviceId);
    
    if (!service) {
        return null; // Servicio no encontrado
    }
    
    if (service.idProfessional !== professionalId) {
        throw new Error('No tienes permisos para eliminar este servicio');
    }
    
    // Si llegamos aquí, el servicio pertenece al profesional, lo eliminamos
    const deletedService = await deleteById(serviceId);
    return deletedService;
};