import { Router } from 'express';
import * as shiftController from '../controllers/shiftController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

// GET /api/shifts - Obtener todos los turnos
router.get('/', shiftController.getAllShifts);

// GET /api/shifts/:id - Obtener turno por ID
router.get('/:id', shiftController.getShiftById);

// GET /api/shifts/user/:idUser - Obtener turnos por usuario
router.get('/user/:idUser', shiftController.getShiftsByUser);

// POST /api/shifts - Crear un nuevo turno - verificar token
router.post('/',verifyToken, shiftController.createShift);

// mostrar todos los turnos de un profesional en especifico
export default router;
