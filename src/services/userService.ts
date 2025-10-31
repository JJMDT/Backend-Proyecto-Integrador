import { create, findAll, findByEmail } from "../repositories/userRepository";
import { UserInput, UserResponse, } from "../interfaces";
// NO SE USA - import bcrypt (para hashear contraseñas en el futuro)

// Función para crear un nuevo usuario
export const createUser = async (userData: UserInput): Promise<UserResponse> => {
    const newUser = await create(userData);
    return newUser;
};

// Función para obtener todos los usuarios
export const getAllUsers = async (): Promise<UserResponse[]> => {
    const users = await findAll();
    return users;
};

export const findUserByEmail = async (emailData: string)=> {
    const findUser = await findByEmail(emailData);
    if (!findUser) {
        const error = new Error("No se encontro el usuario con email");
        throw error
    }
    return findUser
}

// NO SE USA - Funciones disponibles en repository pero no utilizadas aún:
// export const updateUser = async (id: string, userData: UserUpdate): Promise<UserResponse> => { ... }
// export const deleteUser = async (id: string): Promise<boolean> => { ... }