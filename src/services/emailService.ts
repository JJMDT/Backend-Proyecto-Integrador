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

export interface IProfessionalNewShiftData {
  professionalName: string; // Nombre del profesional (receptor)
  userName: string; // Nombre del cliente (usuario)
  petName: string; // Nombre de la mascota
  serviceName: string;
  date: string;
  time: string;
  servicePrice: number;
  establishmentName: string;
}

export interface TurnoCanceladoData {
  userName: string;
  date: string;
  time: string;
  petName: string;
  serviceName: string;
  professionalName: string;
  establishmentName: string;
}

//plantillas para el envio de email
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "¡Bienvenido a Guau que Corte! ✂️🐶",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
          .header { background-color: #4CAF50; padding: 30px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; letter-spacing: 1px; }
          .content { padding: 40px 30px; text-align: center; }
          .welcome-icon { font-size: 50px; margin-bottom: 20px; display: block; }
          .text-body { color: #555; font-size: 16px; margin-bottom: 30px; }
          
          /* Estilos del Botón */
          .btn-container { margin: 30px 0; }
          .btn { 
            display: inline-block; 
            padding: 15px 30px; 
            background-color: #4CAF50; 
            color: white !important; 
            text-decoration: none; 
            border-radius: 50px; 
            font-weight: bold; 
            font-size: 18px; 
            box-shadow: 0 4px 6px rgba(76, 175, 80, 0.3); 
            transition: background-color 0.3s;
          }
          .btn:hover { background-color: #45a049; }
          
          .steps { background-color: #f0f7f1; padding: 20px; border-radius: 8px; text-align: left; margin-top: 20px; border: 1px solid #d4ebd6; }
          .step-item { margin-bottom: 10px; color: #444; font-size: 14px; }
          .step-item:last-child { margin-bottom: 0; }
          
          .footer { background-color: #333; color: #888; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              
              <div class="container">
                <div class="header">
                  <h1>Guau que Corte ✂️</h1>
                </div>

                <div class="content">
                  <span class="welcome-icon">👋🐶</span>
                  
                  <h2 style="color: #2c3e50; margin-top: 0;">¡Hola ${name}!</h2>
                  
                  <p class="text-body">
                    Gracias por unirte a <strong>Guau que Corte</strong>. Tu cuenta ha sido creada exitosamente.
                    <br><br>
                    Ahora puedes reservar turnos para el cuidado y estética de tus mascotas de forma rápida y sencilla.
                  </p>

                  <div class="btn-container">
                    <a href="https://main.d3mszaa590s8z5.amplifyapp.com/" class="btn" target="_blank">
                      Ingresar a la Plataforma
                    </a>
                  </div>

                  <div class="steps">
                    <strong>¿Qué puedes hacer ahora?</strong>
                    <div class="step-item">📅 Busca el servicio que necesitas.</div>
                    <div class="step-item">✅ Reserva tu turno en segundos.</div>
                  </div>
                </div>

                <div class="footer">
                  <p>Enviado con ❤️ por el equipo de Guau que Corte</p>
                </div>
              </div>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `
  }),
  welcomeProfessional: (name: string) => ({
    subject: "Bienvenido al equipo de Profesionales 💼✂️",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
          .header { background-color: #2c3e50; padding: 30px 20px; text-align: center; } /* Azul oscuro para profesionales */
          .header h1 { color: white; margin: 0; font-size: 24px; letter-spacing: 1px; }
          .content { padding: 40px 30px; text-align: center; }
          .icon { font-size: 50px; margin-bottom: 20px; display: block; }
          
          /* Caja de Alerta para datos faltantes */
          .alert-box { 
            background-color: #fff3cd; 
            color: #856404; 
            border: 1px solid #ffeeba; 
            border-radius: 5px; 
            padding: 20px; 
            margin: 20px 0; 
            text-align: left;
          }
          .alert-title { font-weight: bold; margin-bottom: 10px; display: block; font-size: 15px; }
          .alert-list { margin: 0; padding-left: 20px; font-size: 14px; }
          .alert-list li { margin-bottom: 5px; }

          /* Botón */
          .btn-container { margin: 30px 0; }
          .btn { 
            display: inline-block; 
            padding: 15px 30px; 
            background-color: #4CAF50; 
            color: white !important; 
            text-decoration: none; 
            border-radius: 5px; 
            font-weight: bold; 
            font-size: 16px; 
            box-shadow: 0 4px 6px rgba(76, 175, 80, 0.3); 
          }
          .btn:hover { background-color: #45a049; }
          
          .footer { background-color: #f0f0f0; color: #888; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #e0e0e0; }
        </style>
      </head>
      <body>
        
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              
              <div class="container">
                <div class="header">
                  <h1>Guau que Corte | Profesionales</h1>
                </div>

                <div class="content">
                  <span class="icon">💼✂️</span>
                  
                  <h2 style="color: #2c3e50; margin-top: 0;">¡Bienvenido, ${name}!</h2>
                  
                  <p>Estamos encantados de que te sumes a nuestra red de profesionales. Tu cuenta ha sido creada, pero aún no estás visible para los clientes.</p>

                  <div class="alert-box">
                    <span class="alert-title">⚠️ Paso Final Requerido:</span>
                    <p style="margin: 0 0 10px 0; font-size: 14px;">Para que los clientes de tu zona te encuentren, necesitamos que completes tu ubicación en tu perfil:</p>
                    <ul class="alert-list">
                      <li>📍 Calle y Altura</li>
                      <li>🗺️ Provincia y Localidad</li>
                      <li>Codigo Postal</li>
                    </ul>
                  </div>

                  <p>Completa estos datos ahora para empezar a recibir turnos inmediatamente.</p>

                  <div class="btn-container">
                    <a href="https://main.dpn3jlgxgqznm.amplifyapp.com/" class="btn" target="_blank">
                      Completar mi Perfil Ahora
                    </a>
                  </div>

                </div>

                <div class="footer">
                  <p>Si tienes problemas para configurar tu cuenta, responde a este correo.</p>
                  <p>© Guau que Corte Profesionales</p>
                </div>
              </div>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `
  }),
  professionalProfileUpdate: (name: string) => ({
    subject: "Perfil actualizado exitosamente",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; text-align: center; }
          .icon { font-size: 48px; margin-bottom: 20px; display: block; }
          .btn { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; padding: 15px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Perfil Actualizado</h1>
          </div>
          
          <div class="content">
            <span class="icon">👨‍⚕️✅</span>
            <h2>¡Hola ${name}!</h2>
            <p>Te informamos que los cambios en tu perfil profesional se han guardado correctamente.</p>
            <p>Tu nueva información ya está visible para todos los clientes en la plataforma.</p>
            
            <p style="margin-top: 20px; color: #666; font-size: 14px;">
              Si no realizaste estos cambios, por favor contacta a soporte inmediatamente.
            </p>
          </div>
          
          <div class="footer">
            <p>Este es un email automático del sistema.</p>
          </div>
        </div>
      </body>
      </html>
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
  professionalNewShift: (data: IProfessionalNewShiftData) => ({
    subject: `🔔 ¡NUEVA RESERVA! Turno para ${data.petName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
          
          /* Azul oscuro para el Header Profesional */
          .header { background-color: #2c3e50; padding: 30px 20px; text-align: center; } 
          .header h1 { color: white; margin: 0; font-size: 24px; letter-spacing: 1px; }
          .content { padding: 40px 30px; text-align: center; }
          .icon { font-size: 50px; margin-bottom: 20px; display: block; }
          
          /* Tarjeta de Detalle del Turno */
          .detail-card { 
            background-color: #f0f7f1; /* Fondo suave verde-claro */
            border: 1px solid #d4ebd6; 
            border-left: 5px solid #4CAF50; /* Línea verde de confirmación/éxito */
            border-radius: 5px; 
            padding: 20px; 
            margin: 20px 0; 
            text-align: left;
          }
          /* Eliminamos margin-bottom en detail-row para manejar el espaciado con detail-value */
          .detail-row { padding-top: 5px; } 

          /* MEJORA MÓVIL: Etiqueta y Valor en líneas separadas */
          .detail-label { 
            font-weight: bold; 
            color: #4CAF50; 
            display: block; /* Ocupa todo el ancho, forzando salto de línea */
            margin-bottom: 2px;
            font-size: 14px; /* Más sutil */
          }
          .detail-value {
            display: block; /* Ocupa todo el ancho */
            font-size: 16px; /* Más prominente */
            margin-bottom: 15px; /* Espacio después de cada valor */
          }
          /* FIN MEJORA MÓVIL */


          /* Botón */
          .btn-container { margin: 30px 0; }
          .btn { 
            display: inline-block; 
            padding: 15px 30px; 
            background-color: #4CAF50; 
            color: white !important; 
            text-decoration: none; 
            border-radius: 5px; 
            font-weight: bold; 
            font-size: 16px; 
            box-shadow: 0 4px 6px rgba(76, 175, 80, 0.3); 
          }
          .btn:hover { background-color: #45a049; }
          
          .footer { background-color: #f0f0f0; color: #888; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #e0e0e0; }
        </style>
      </head>
      <body>
        
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              
              <div class="container">
                <div class="header">
                  <h1>¡Nuevo Turno Agendado!</h1>
                </div>

                <div class="content">
                  <span class="icon">🔔🗓️</span>
                  
                  <h2 style="color: #2c3e50; margin-top: 0;">¡Hola ${data.professionalName}!</h2>
                  
                  <p>Un cliente ha reservado un turno para uno de tus servicios. ¡Revisa los detalles a continuación para prepararte!</p>

                  <div class="detail-card">
                    <h3 style="margin-top: 0; color: #4CAF50;">Detalles de la Reserva</h3>
                    
                    <div class="detail-row">
                      <span class="detail-label">📅 Fecha:</span> 
                      <span class="detail-value">${data.date}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">🕐 Hora:</span> 
                      <span class="detail-value">${data.time}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">👤 Cliente:</span> 
                      <span class="detail-value">${data.userName}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">🐾 Mascota:</span> 
                      <span class="detail-value">${data.petName}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">💼 Servicio:</span> 
                      <span class="detail-value">${data.serviceName}</span>
                    </div>

                    <div class="detail-row">
                      <span class="detail-label">💰 Precio:</span> 
                      <span class="detail-value">$${data.servicePrice}</span>
                    </div>
                  </div>
                </div>

                <div class="footer">
                  <p>Guau que Corte Profesionales | ${data.establishmentName}</p>
                </div>
              </div>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `
  }),

  turnoCancelado: (data: TurnoCanceladoData) => ({
    subject: "❌ Turno cancelado",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #e74c3c;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 24px;
            letter-spacing: 1px;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .icon {
            font-size: 50px;
            margin-bottom: 20px;
            display: block;
          }
          .detail-card {
            background-color: #ffeaea;
            border: 1px solid #f5c6cb;
            border-left: 5px solid #e74c3c;
            border-radius: 5px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
          }
          .detail-row {
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: bold;
            color: #e74c3c;
            display: inline-block;
            width: 120px;
          }
          .detail-value {
            color: #333;
          }
          .footer {
            background-color: #f0f0f0;
            color: #888;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            border-top: 1px solid #e0e0e0;
          }
        </style>
      </head>
      <body>
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <div class="container">
                <div class="header">
                  <h1>Turno Cancelado</h1>
                </div>

                <div class="content">
                  <span class="icon">❌📅</span>
                  
                  <h2 style="color: #e74c3c; margin-top: 0;">Hola ${data.userName}</h2>
                  
                  <p>Lamentamos informarte que tu turno ha sido cancelado. Los detalles del turno cancelado son:</p>

                  <div class="detail-card">
                    <h3 style="margin-top: 0; color: #e74c3c;">Detalles del Turno Cancelado</h3>
                    
                    <div class="detail-row">
                      <span class="detail-label">📅 Fecha:</span>
                      <span class="detail-value">${data.date}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">🕐 Hora:</span>
                      <span class="detail-value">${data.time}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">🐾 Mascota:</span>
                      <span class="detail-value">${data.petName}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">💼 Servicio:</span>
                      <span class="detail-value">${data.serviceName}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">👨‍⚕️ Profesional:</span>
                      <span class="detail-value">${data.professionalName}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">🏥 Establecimiento:</span>
                      <span class="detail-value">${data.establishmentName}</span>
                    </div>
                  </div>
                  
                  <p style="margin-top: 30px; color: #666;">
                    Si tienes alguna pregunta sobre esta cancelación, no dudes en contactarnos.
                  </p>
                  
                  <p style="color: #666;">
                    Puedes reservar un nuevo turno cuando gustes a través de nuestra plataforma.
                  </p>
                </div>

                <div class="footer">
                  <p>Este es un email automático, por favor no respondas a este mensaje.</p>
                  <p>© Guau que Corte</p>
                </div>
              </div>
            </td>
          </tr>
        </table>
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



