import { User } from "../models";
import { UserInput } from "../interfaces";
// NO SE USA - UserUpdate (se usará cuando implementemos actualización)

// Función para crear un nuevo usuario
export const create = async (user: UserInput) => {
    return await User.create(user);
};

// Función para obtener todos los usuarios
export const findAll = async () => {
    return await User.findAll();
};

// NO SE USA - Funciones para actualizar y eliminar (implementar cuando se necesiten)
// export const update = async (id: string, user: UserUpdate) => {
//     const existingUser = await User.findByPk(id);
//     if (!existingUser) {
//         throw new Error("Usuario no encontrado");
//     }
//     return await existingUser.update(user);
// };

// export const deleteUser = async (id: string) => {
//     const existingUser = await User.findByPk(id);
//     if (!existingUser) {
//         throw new Error("Usuario no encontrado");
//     }
//     await existingUser.destroy();
//     return true;
// };
