import { Router } from "express";
import { create, getAll, getAllWithServices } from '../controllers/professionalContrller'

const router = Router();

router.route('/').post(create).get(getAll)
router.route('/services').get(getAllWithServices)

export default router