import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();
const userController = new UserController();

// Ruta para crear un nuevo usuario
router.post("/users", (req, res) => userController.createUser(req, res));
// Ruta para obtener todos los usuarios
router.get("/users", (req, res) => userController.getAllUsers(req, res));

export default router;