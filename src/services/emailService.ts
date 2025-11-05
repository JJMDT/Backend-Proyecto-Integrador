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

//Definís tus plantillas (pueden ser texto o HTML)
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "¡Bienvenido!",
    html: `
    <h1>Hola ${name}!</h1>
    <p>Gracias por registrarte </p>
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



