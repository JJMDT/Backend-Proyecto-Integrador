import { Router } from "express";
import { chatbotController } from "../controllers/chatbot.controller";

const router = Router();

router.post("/chat", chatbotController.ask);

export default router;
