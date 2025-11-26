import { Router } from "express";
import { login, profileUser , logingProfessional } from '../controllers/authController'
import { verifyToken } from '../middlewares/authMiddleware'

const router = Router();

//auth para User
router.post('/login', login);
router.get(
    '/profile',
    verifyToken,
    profileUser
)

//auth para Professional
router.post('/login/professional',logingProfessional);


export default router;