import QRCode from 'qrcode';
import { logger } from '../config/logger';

// Interface para los datos del QR del turno
export interface QRShiftData {
  idTurno: string;
  date: string;
  time: string;
  petName: string;
  service: {
    name: string;
    price: number;
    description?: string;
  };
  professional: {
    name: string;
    lastname: string;
    specialty: string;
    nameEstablishment: string;
  };
  usuario: {
    name: string;
    lastname: string;
    email: string;
    phone: string;
  };
}

/**
 * Genera un código QR en formato Data URL (base64)
 * @param data - Datos a codificar en el QR
 * @returns String con el QR en formato Data URL
 */
export const generateQRCode = async (data: QRShiftData): Promise<string> => {
  try {
    // Convertir los datos a JSON string
    const qrDataString = JSON.stringify(data);

    // Generar el QR en formato Data URL (imagen base64)
    const qrCodeImage = await QRCode.toDataURL(qrDataString, {
      errorCorrectionLevel: 'M', // Nivel de corrección de errores
      type: 'image/png',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',  // Color del QR
        light: '#FFFFFF'  // Color del fondo
      }
    });

    logger.info('Código QR generado exitosamente');
    return qrCodeImage;
  } catch (error) {
    logger.error('Error al generar código QR:', error);
    throw new Error('No se pudo generar el código QR');
  }
};

/**
 * Genera un código QR y lo guarda como archivo (opcional)
 * @param data - Datos a codificar en el QR
 * @param filePath - Ruta donde guardar el archivo
 */
export const generateQRCodeFile = async (data: QRShiftData, filePath: string): Promise<void> => {
  try {
    const qrDataString = JSON.stringify(data);
    
    await QRCode.toFile(filePath, qrDataString);

    logger.info(`Código QR guardado en: ${filePath}`);
  } catch (error) {
    logger.error('Error al guardar código QR como archivo:', error);
    throw new Error('No se pudo guardar el código QR');
  }
};
