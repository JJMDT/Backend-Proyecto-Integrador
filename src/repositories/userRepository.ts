import { User } from "../models";
import { UserInput,UserUpdate } from "../interfaces";

export class UserRepository {
    // Crear un nuevo usuario
    async create(user: UserInput){
        return await User.create(user);
    }

    // Obtener todos los usuarios
    async findAll(){
        return await User.findAll();
    }

    // modificar un usuario por id
    async update(id: string, user: UserUpdate){
        const existingUser = await User.findByPk(id);
        if (!existingUser) {
            throw new Error("Usuario no encontrado");
        }
        return await existingUser.update(user);
    }

    // Eliminar un usuario por id
    async delete(id: string){
        const existingUser = await User.findByPk(id);
        if (!existingUser) {
            throw new Error("Usuario no encontrado");
        }
        await existingUser.destroy();
        return true;
    }
}
