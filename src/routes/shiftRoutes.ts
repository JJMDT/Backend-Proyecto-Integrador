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

// GET /api/shifts/professional/:idProfessional - Obtener turnos por profesional
router.get('/professional/:idProfessional', shiftController.getShiftsByProfessional);

// POST /api/shifts - Crear un nuevo turno - verificar token
router.post('/',verifyToken, shiftController.createShift);

// DELETE /api/shifts/:id - Eliminar turno por ID - verificar token
router.delete('/:id', verifyToken, shiftController.deleteShift);

export default router;
