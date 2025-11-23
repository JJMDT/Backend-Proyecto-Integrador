import cron from 'node-cron';
import { logger } from "../../../config/logger";


export const exampleCronJob = async () => {
    cron.schedule('* * * * *', async () => {
        logger.info(`Ejecutando tarea  cron de ejemplo , fecha:${new Date()}`);
        try {
        } catch (error) {
            logger.error('Error en el cron:', error);
        }
    });
};