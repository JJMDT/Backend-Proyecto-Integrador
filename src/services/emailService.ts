import nodemailer from "nodemailer";
import dotenv from 'dotenv'
import { logger } from "../config/logger";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Interface para los datos del turno confirmado
export interface TurnoConfirmadoData {
  userName: string;
  date: string;
  time: string;
  petName: string;
  serviceName: string;
  servicePrice: number;
  professionalName: string;
  establishmentName: string;
  qrCodeImage: string; // Data URL del QR
}

//plantillas para el envio de email
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "¡Bienvenido!",
    html: `
    <h1>Hola ${name}!</h1>
    <p>Gracias por registrarte </p>
    `
  }),
  
  turnoconfirmado: (data: TurnoConfirmadoData) => ({
    subject: "✅ Confirmación de turno",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 5px 5px;
          }
          .detail-row {
            margin: 10px 0;
            padding: 10px;
            background-color: #f5f5f5;
            border-left: 4px solid #4CAF50;
          }
          .detail-label {
            font-weight: bold;
            color: #4CAF50;
          }
          .qr-container {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .qr-container img {
            max-width: 300px;
            border: 2px solid #4CAF50;
            padding: 10px;
            background-color: white;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding: 15px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ ¡Turno Confirmado!</h1>
          </div>
          
          <div class="content">
            <p>Hola <strong>${data.userName}</strong>,</p>
            <p>Tu turno ha sido registrado exitosamente. A continuación los detalles:</p>
            
            <div class="detail-row">
              <span class="detail-label">📅 Fecha:</span> ${data.date}
            </div>
            
            <div class="detail-row">
              <span class="detail-label">🕐 Hora:</span> ${data.time}
            </div>
            
            <div class="detail-row">
              <span class="detail-label">🐾 Mascota:</span> ${data.petName}
            </div>
            
            <div class="detail-row">
              <span class="detail-label">💼 Servicio:</span> ${data.serviceName}
            </div>
            
            <div class="detail-row">
              <span class="detail-label">💰 Precio:</span> $${data.servicePrice}
            </div>
            
            <div class="detail-row">
              <span class="detail-label">👨‍⚕️ Profesional:</span> ${data.professionalName}
            </div>
            
            <div class="detail-row">
              <span class="detail-label">🏥 Establecimiento:</span> ${data.establishmentName}
            </div>
            
            <div class="qr-container">
              <h3>Código QR de tu turno</h3>
              <p style="font-size: 14px; color: #666;">Presenta este código QR el día de tu cita</p>
              <img src="cid:qr@turno" alt="QR Code del Turno" />
            </div>
            
            <p style="margin-top: 30px;">
              <strong>Importante:</strong> Por favor llega 10 minutos antes de tu cita.
            </p>
            
            <p>Si necesitas cancelar o reprogramar tu turno, por favor contáctanos con anticipación.</p>
          </div>
          
          <div class="footer">
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  resetPassword: (name: string, link: string) => ({
    subject: "Recupera tu contraseña 🔑",
    html: `<p>Hola ${name},</p><p>Puedes restablecer tu contraseña haciendo clic <a href="${link}">aquí</a>.</p>`,
  }),

  accountVerified: (name: string) => ({
    subject: "Cuenta verificada ",
    html: `<p>Hola ${name}, tu cuenta ha sido verificada con éxito.</p>`,
  }),
};

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      html,
    });
    logger.info("Email enviado con exito:", info.response);
    return true;
  } catch (error) {
    logger.error("Error al enviar email:", error);
    return false;
  }
}

// Nueva versión que permite attachments (inline via cid)
export async function sendEmailWithAttachments(to: string, subject: string, html: string, attachments?: any[]) {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      html,
      attachments // array de objetos { filename, content, cid }
    });
    logger.info("Email enviado con exito (con attachments):", info.response);
    return true;
  } catch (error) {
    logger.error("Error al enviar email con attachments:", error);
    return false;
  }
}



