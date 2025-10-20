// Importamos Express, cors y el logger
import express from 'express';
import cors from 'cors';
import { logger } from './config/logger';
import userRoutes from './routes/userRoutes';
import serviceRoutes from './routes/serviceRoutes';
import professionalRoutes from './routes/professionalRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import authRoutes  from './routes/authRoutes';

// Inicializamos la aplicación de Express
const app = express();

// === Middlewares globales ===

// Configuración de CORS
app.use(cors());

// Middleware para analizar el cuerpo de las peticiones
// Permite recibir y procesar JSON en el body (POST, PUT, etc.)
app.use(express.json());
// Si no vas a recibir formularios, podés eliminar esta línea
app.use(express.urlencoded({ extended: true }));

// Middleware para logs
// app.use((req, res, next) => {
//   logger.info({ req: req }, 'Petición entrante');
//   next();
// });

// === Rutas de la API ===

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Hola! El servidor Express está funcionando.');
    logger.info("Funciona la ruta get de ejemplo");
});

// Enlaza tus rutas aquí cuando las crees, por ejemplo:
// import statusRoutes from './routes/statusRoutes';
// app.use('/', statusRoutes);
app.use("/api", userRoutes);
app.use("/api", serviceRoutes);               
app.use("/api", professionalRoutes);
app.use("/api", appointmentRoutes);
app.use('/api',authRoutes);


// Manejador de errores 404. Este middleware debe ir al final de todas las rutas
app.use((req, res) => {
    res.status(404).json({
        status: 'error 404',
        message: 'Esa ruta no existe.'
    });
    logger.warn("Ingreso a una ruta que no existe");
});

export default app;