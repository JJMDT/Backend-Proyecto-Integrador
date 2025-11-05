import { Router } from "express";
import { create, getAll, getAllWithServices } from '../controllers/professionalContrller';
import { verifyToken } from '../middlewares/authMiddleware'

const router = Router();

router.route('/').post(create).get(getAll)
router.route('/services').get(
    verifyToken,
    getAllWithServices
)

export default router