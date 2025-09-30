import { Router } from "express";
import { createUser, getAllUsers } from "../controllers/userController";

const router = Router();

// Ruta para crear un nuevo usuario
router.post("/users", createUser);
// Ruta para obtener todos los usuarios
router.get("/users", getAllUsers);

export default router;