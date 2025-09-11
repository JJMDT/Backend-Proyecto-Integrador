import app from './src/app' // Importar la app de Express ya configurada
// const dotenv = require('dotenv');
import dotenv from 'dotenv'
import { logger } from './src/config/logger';
import {conexionBasedeDatos} from './src/pruebaconexion'


dotenv.config();


// Definir puerto desde .env o por defecto
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST;

// Iniciar el servidor
const startExpress = async () => {
    app.listen(PORT, () => {
        logger.info(`Servidor corriendo en http://${HOST}:${PORT}`);
    });
}


const startServer = async () => {
    await startExpress();
    await conexionBasedeDatos();
}

startServer();