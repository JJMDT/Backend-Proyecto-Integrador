import { Router} from "express";
import { createService, getAllServices } from "../controllers/serviceController";
import { verifyToken } from '../middlewares/authMiddleware'
const router = Router();

// Ruta para crear un nuevo servicio
router.post("/", verifyToken, createService);
// Ruta para obtener todos los servicios
router.get("/", getAllServices);

export default router;