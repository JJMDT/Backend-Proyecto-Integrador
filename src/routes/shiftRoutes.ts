import { Router } from 'express';
import * as shiftController from '../controllers/shiftController';

const router = Router();

// GET /api/shifts - Obtener todos los turnos
router.get('/', shiftController.getAllShifts);

// GET /api/shifts/:id - Obtener turno por ID
router.get('/:id', shiftController.getShiftById);

// GET /api/shifts/user/:idUser - Obtener turnos por usuario
router.get('/user/:idUser', shiftController.getShiftsByUser);

// POST /api/shifts - Crear un nuevo turno
router.post('/', shiftController.createShift);

export default router;
