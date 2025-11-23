import { Request, Response } from "express";
import { chatbotService } from "../services/chatbot.service";

// Servicios reales de tu backend:
import { getAllProfessionals, getProfessionalWithServices } from "../services/professionalService";
import { getAllServices } from "../services/serviceService";
import { getAllShifts } from "../services/shiftService";

export class ChatbotController {

  async ask(req: Request, res: Response) {
    try {
      const { message } = req.body;

      // 1) PRIMERA RESPUESTA: La IA decide si necesita datos o no
      const aiRawResponse = await chatbotService.askMessage(message);

      // Intentar extraer JSON de la respuesta (puede venir con markdown)
      let actionJSON;
      try {
        // Limpiar la respuesta de posibles bloques de código markdown
        let cleanResponse = aiRawResponse.trim();
        
        // Remover bloques de código si existen
        cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        
        // Buscar el JSON en la respuesta
        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          actionJSON = JSON.parse(jsonMatch[0]);
        } else {
          // No hay JSON, es una respuesta de texto normal
          return res.json({ answer: aiRawResponse });
        }
      } catch (error) {
        // Error al parsear, devolver como texto normal
        console.log("No se pudo parsear JSON, devolviendo texto:", aiRawResponse);
        return res.json({ answer: aiRawResponse });
      }

      if (!actionJSON.action) {
        // No es acción válida → responder el texto normalmente
        return res.json({ answer: aiRawResponse });
      }

      // =============================
      // 2) EJECUTAR ACCIÓN SOLICITADA
      // =============================

      let dataFromBackend;

      switch (actionJSON.action) {

        case "get_professionals":
          dataFromBackend = await getAllProfessionals();
          break;

        case "get_services":
          dataFromBackend = await getAllServices();
          break;

        case "get_professional_services":
          dataFromBackend = await getProfessionalWithServices(
            actionJSON.payload.professionalId
          );
          break;

        case "get_available_shifts":
          // Por ahora, como no tenemos función específica, obtenemos todos los turnos
          // y dejamos que la IA filtre la información
          dataFromBackend = await getAllShifts();
          break;

        default:
          // Mensaje amigable cuando la IA no puede procesar la solicitud
          return res.json({
            answer: "Disculpá, en este momento no puedo procesar ese tipo de consulta automáticamente. " +
                    "Te recomiendo que consultes directamente en nuestra sección de turnos o contactes con nosotros. " +
                    "¿Hay algo más en lo que pueda ayudarte?"
          });
      }

      // =============================
      // 3) SEGUNDA RESPUESTA: IA genera respuesta final con datos reales
      // =============================

      const finalResponse = await chatbotService.askMessage(`
Datos reales del backend para responder al usuario:
${JSON.stringify(dataFromBackend, null, 2)}

Consulta original del usuario: "${message}"

Genera una respuesta clara, amable y profesional presentando esta información.
NO devuelvas JSON ahora, solo texto amigable para el usuario.
Si son servicios, menciona nombre, descripción y precio.
Si son profesionales, menciona nombre, especialidad y establecimiento.
      `);

      return res.json({ answer: finalResponse });

    } catch (error) {
      console.error("Error en chatbot:", error);
      return res.status(500).json({
        error: "Error interno procesando la solicitud del chatbot"
      });
    }
  }
}

export const chatbotController = new ChatbotController();
