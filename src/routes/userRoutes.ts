import { Router } from "express";
import { createUser, getAllUsers } from "../controllers/userController";
import { verifyToken } from '../middlewares/authMiddleware'

const router = Router();

// Ruta para crear un nuevo usuario
router.post("/users", createUser);
// Ruta para obtener todos los usuarios
router.get(
    "/users",
    verifyToken,
    getAllUsers
);

export default router;