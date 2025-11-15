import { Router } from "express";
import { create, getAll, getAllWithServices, getOneWithServices } from '../controllers/professionalContrller';
import { verifyToken } from '../middlewares/authMiddleware'

const router = Router();

router.route('/').post(create).get(getAll)
router.route('/services').get(getAllWithServices)
router.route('/:id/services').get(getOneWithServices)

export default router