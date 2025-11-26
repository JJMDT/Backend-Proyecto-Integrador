import { Router} from "express";
import { createService, getAllServices, deleteService } from "../controllers/serviceController";

const router = Router();

// Ruta para crear un nuevo servicio
router.post("/", createService);
// Ruta para obtener todos los servicios
router.get("/", getAllServices);
// Ruta para eliminar un servicio por ID
router.delete("/:id", deleteService);

export default router;