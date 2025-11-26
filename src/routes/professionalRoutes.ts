import { Router } from "express";
import { create, getAll, getAllWithServices, getOneWithServices, updateProfessional } from '../controllers/professionalController';
import { deleteProfessionalServiceController } from '../controllers/serviceController';
import { verifyToken } from '../middlewares/authMiddleware'

const router = Router();

router.route('/').post(create).get(getAll)
router.route('/services').get(getAllWithServices)
router.route('/:id/services').get(getOneWithServices).patch(verifyToken, updateProfessional)
// Ruta para que un profesional elimine uno de sus servicios
router.delete('/:professionalId/services/:serviceId', verifyToken, deleteProfessionalServiceController)

export default router