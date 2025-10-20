// Interface para el User completo (como se almacena en BD)
export interface User {
    id: string; // UUID como string es más compatible
    name: string;
    lastname: string;
    dni: string;
    email: string;
    password: string;
    rol: "admin" | "user" | "professional"; // Corregido para tener todos los roles
    createdAt: Date;
    updatedAt: Date;
}

// Interface para los datos que vienen del frontend (sin id, timestamps)
export interface UserInput {
    name: string;
    lastname: string;
    dni: string;
    email: string;
    password: string;
    rol?: "admin" | "user" | "professional"; // Corregido para tener todos los roles
}

// Interface para actualizar usuario (todos los campos opcionales)
export interface UserUpdate {
    name?: string;
    lastname?: string;
    dni?: string;
    email?: string;
    password?: string;
    rol?: "admin" | "user" | "professional";
}

// Interface para login (solo email y password)
export interface UserLogin {
    email: string;
    password: string;
}

// Interface para respuesta del usuario (sin password)
export interface UserResponse {
    id: string;
    name: string;
    lastname: string;
    dni: string;
    email: string;
    rol: "admin" | "user" | "professional";
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

