import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

dotenv.config();

//Extendemos la interfaz Request de Express para agregar la propiedad "user"
interface ITokenRequest extends Request {
    user?: string | JwtPayload;
}

export const verifyToken = (req: ITokenRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ status: 'error 401', message: 'Token requerido' });
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET as string);
        req.user = decoded; // Guardamos la información del usuario decodificada en el objeto de solicitud
        next(); // Llamamos al siguiente middleware o ruta
    } catch (error) {
        logger.error('Error al verificar el token:', error);
        return res.status(403).json({ status: 'error 403', message: 'Token inválido' });
    }
}
