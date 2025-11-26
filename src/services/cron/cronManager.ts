import { exampleCronJob} from './cronjobs/exampleCronJob'
import { logger } from "../../config/logger";


export const loadCronJobs = async () => {
    logger.info('Inicializando tareas con Cron ...');
    await exampleCronJob();
};