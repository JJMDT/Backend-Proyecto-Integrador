// Interface para el Appointment completo (como se almacena en BD)
export interface IAppointment {
    id: string;
    idUser: string;
    idService: string;
    date: Date;
    time: string; // "09:30", "14:00", etc.
    phone: string;
    petname: string;
    createdAt: Date;
    updatedAt: Date;
}

// Interface para los datos que vienen del frontend (sin id, timestamps)
export interface AppointmentInput {
    idUser: string;
    idService: string;
    date: Date;
    time: string;
    phone: string;
    petname: string;
}

// Interface para actualizar appointment (todos los campos opcionales)
export interface AppointmentUpdate {
    idUser?: string;
    idService?: string;
    date?: Date;
    time?: string;
    phone?: string;
    petname?: string;
}

// Interface para respuesta del appointment (completa)
export interface AppointmentResponse {
    id: string;
    idUser: string;
    idService: string;
    date: Date;
    time: string;
    phone: string;
    petname: string;
    createdAt: Date;
    updatedAt: Date;
}

// Interface para appointment con información relacionada (para consultas con joins)
export interface AppointmentWithDetails {
    id: string;
    date: Date;
    time: string;
    phone: string;
    petname: string;
    user: {
        id: string;
        name: string;
        lastname: string;
        email: string;
    };
    service: {
        id: string;
        name: string;
        description: string;
        price: number;
    };
    createdAt: Date;
    updatedAt: Date;
}