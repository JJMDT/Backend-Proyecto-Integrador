import { Router } from "express";
import { create, getAll } from '../controllers/professionalContrller'

const router = Router();

router.route('/').post(create).get(getAll)

export default router