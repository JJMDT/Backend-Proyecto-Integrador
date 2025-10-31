import { Router } from "express";
import { login, profileUser } from '../controllers/authController'
import { verifyToken } from '../middlewares/authMiddleware'

const router = Router();


router.post('/login', login);
router.get(
    '/profile',
    verifyToken,
    profileUser
)

export default router;