import { UserRepository } from "../repositories/userRepository";
import { UserInput, UserResponse } from "../interfaces";
// NO SE USA - import bcrypt (para hashear contraseñas en el futuro)

const userRepository = new UserRepository();

export class UserService {
    // Crear un nuevo usuario
    async createUser(userData: UserInput): Promise<UserResponse> {
        const newUser = await userRepository.create(userData);
        return newUser;
    }

    // Obtener todos los usuarios
    async getAllUsers(): Promise<UserResponse[]> {
        const users = await userRepository.findAll();
        return users;
    }

    // NO SE USA - Métodos disponibles en repository pero no utilizados aún:
    // async updateUser(id: string, userData: UserUpdate): Promise<UserResponse> 
    // async deleteUser(id: string): Promise<boolean>
}