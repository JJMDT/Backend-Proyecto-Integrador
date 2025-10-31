import { Router} from "express";
import { createService, getAllServices } from "../controllers/serviceController";

const router = Router();

// Ruta para crear un nuevo servicio
router.post("/", createService);
// Ruta para obtener todos los servicios
router.get("/", getAllServices);

export default router;