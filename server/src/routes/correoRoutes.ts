import { Router } from "express";
import correoController from "../controllers/correoController";

const router = Router();

// Crear la ruta para el envío de correos
router.post('/enviar-correo', correoController.envioCorreo);
router.post('/validar-token', correoController.validarToken);

export default router;
