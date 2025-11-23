import { Router } from "express";
import { create, getAll, getAllWithServices, getOneWithServices, updateProfessional } from '../controllers/professionalController';
import { verifyToken } from '../middlewares/authMiddleware'

const router = Router();

router.route('/').post(create).get(getAll)
router.route('/services').get(getAllWithServices)
router.route('/:id/services').get(getOneWithServices).patch(verifyToken, updateProfessional)

export default router