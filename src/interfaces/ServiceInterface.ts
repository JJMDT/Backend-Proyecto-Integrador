// Interface para el Service completo (como se almacena en BD)
export interface Service {
    id: string; // UUID como string es más compatible
    idProfessional: string;
    name: string;
    description: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}

// Interface para los datos que vienen del frontend (sin id, timestamps)
export interface ServiceInput {
    idProfessional: string; // <-- Agregado
    name: string;
    description: string;
    price: number;
}

// Interface para actualizar servicio (todos los campos opcionales)
export interface ServiceUpdate {
    name?: string;
    description?: string;
    price?: number;
}