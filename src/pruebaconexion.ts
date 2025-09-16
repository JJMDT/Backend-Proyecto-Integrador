// NO SE USA - Este archivo era para probar la conexión con mysql2
// Ahora usamos Sequelize en db.ts

// import pool from './db';
// import { logger } from '../src/config/logger'
// (async () => {
//   try {
//     const [rows] = await pool.query('SELECT NOW() AS now');
//     //console.log('Conexión exitosa ', (rows as any)[0].now);
//     logger.info(`Conexion exitosa ${(rows as any)[0].now}`)
//     process.exit(0);
//   } catch (err) {
//     console.error('Error de conexión ', err);
//     process.exit(1);
//   }
// })();

// export const conexionBasedeDatos = async () => {
//     try {
//     const [rows] = await pool.query('SELECT NOW() AS now');
//     //console.log('Conexión exitosa ', (rows as any)[0].now);
//     logger.info(`Conexion exitosa ${(rows as any)[0].now}`)
//     process.exit(0);
//   } catch (err) {
//     logger.error('Error de conexión ', err);
//     //process.exit(1);
//   }
// }
