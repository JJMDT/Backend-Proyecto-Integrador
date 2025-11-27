import axios from "axios";
import { logger } from "../config/logger";


export interface IAddressData {
    street: string;
    streetNumber: string;
    province: string;
}

//metodo para obtner longitud y latitud
export const getCoordinates = async (addressData: IAddressData) => {
    logger.info("Obtentiendo cordenadas del Professional")
    try {
        // se arma la dirección completa dinámicamente
        const fullAddress = `${addressData.street} ${addressData.streetNumber},${addressData.province ?? ""}`.trim();
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`;
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "app-back/1.0 (edgardo9000@gmail.com)",
                "Accept-Language": "es-ES"
            }
        });
        if (!response.data.length) {
            logger.error("No se encontraron coordenadas");
            return;
        }
        logger.info(response.data[0])
        const { lat, lon } = response.data[0];
        const location = {
            latitude: Number(lat),
            longitude: Number(lon)
        }
        return location;
    } catch (error) {
        logger.error("Error al obtener coordenadas:", error);
    }
}

