// Interface para el Shift completo (como se almacena en BD)
export interface IShift {
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
export interface ShiftInput {
    idUser: string;
    idService: string;
    date: Date;
    time: string;
    phone: string;
    petname: string;
}

// Interface para actualizar shift (todos los campos opcionales)
export interface ShiftUpdate {
    idUser?: string;
    idService?: string;
    date?: Date;
    time?: string;
    phone?: string;
    petname?: string;
}

// Interface para respuesta del shift (completa)
export interface ShiftResponse {
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

// Interface para shift con información relacionada (para consultas con joins)
export interface ShiftWithDetails {
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
