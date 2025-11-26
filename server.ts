import app from './src/app' // Importar la app de Express ya configurada
import dotenv from 'dotenv'
import { logger } from './src/config/logger';
import { testConnection, createDatabaseIfNotExists } from './src/db';
import { syncDatabase } from './src/models';
import { loadCronJobs } from './src/services/cron/cronManager'

dotenv.config();

// Configuración del servidor
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

//aca ejecuto mis tareas que estan con la libreria Cron
loadCronJobs()

// Iniciar el servidor
const startExpress = async () => {
    app.listen(PORT, () => {
        logger.info(`Servidor corriendo en http://${HOST}:${PORT}`);
    });
}

// Función para inicializar la base de datos
const initDatabase = async () => {
    await createDatabaseIfNotExists(); // 1. Crear BD si no existe
    await testConnection();            // 2. Probar conexión
    await syncDatabase();
};

// Función principal para iniciar todo
const startServer = async () => {
    try {
        await initDatabase();
        await startExpress();
        logger.info('🚀 Servidor iniciado correctamente');
    } catch (error) {
        logger.error('❌ Error al iniciar servidor:', error);
        process.exit(1);
    }
}

startServer();
