import { Router } from 'express';
import * as appointmentController from '../controllers/appointmentController';

const router = Router();

// GET /api/appointments - Obtener todos los turnos
router.get('/', appointmentController.getAllAppointments);

// GET /api/appointments/:id - Obtener turno por ID
router.get('/:id', appointmentController.getAppointmentById);

// GET /api/appointments/user/:idUser - Obtener turnos por usuario
router.get('/user/:idUser', appointmentController.getAppointmentsByUser);

// POST /api/appointments - Crear un nuevo turno
router.post('/', appointmentController.createAppointment);

export default router;