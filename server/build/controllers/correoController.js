"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailer_config_1 = require("../mailer_config");
const usuarioController_1 = __importDefault(require("./usuarioController"));
const correoController = {
    envioCorreo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                // Validación del userId
                if (!userId || typeof userId !== "number") {
                    return res.status(400).json({ error: "El userId es inválido o no se proporcionó." });
                }
                // Obtener el correo del usuario desde el usuarioController
                const gmailRes = yield usuarioController_1.default.getGmail(userId);
                if (!gmailRes) {
                    return res.status(404).json({ error: "Correo no encontrado para este usuario." });
                }
                // Generar el supertoken (se puede configurar una clave secreta usando variables de entorno)
                const supertoken = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h" });
                // Crear el contenido HTML para el correo
                const htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #111; color: #fff; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px;">
          <h2 style="text-align: center; background-color: #222; padding: 15px; border-radius: 8px;">Inicio de Sesión</h2>
          <p style="text-align: center;">Hola,</p>
          <p style="text-align: center;">Este es tu supertoken para iniciar sesión:</p>
          <p style="text-align: center; font-size: 18px; font-weight: bold; background-color: #333; padding: 10px; border-radius: 5px;">${supertoken}</p>
          <p style="text-align: center;">Este token expirará en <strong>1 hora</strong>.</p>
          <p style="text-align: center; font-size: 14px; color: #aaa;">Si no solicitaste esto, ignora este mensaje.</p>
        </div>
      `;
                // Enviar el correo usando transporter
                const info = yield mailer_config_1.transporter.sendMail({
                    from: '"Pruebas" <luismanuelr245@gmail.com>',
                    to: gmailRes,
                    subject: "Supertoken para Inicio de Sesión",
                    html: htmlContent,
                });
                console.log("Correo enviado: %s", info.messageId);
                return res.status(200).json({ message: "Correo enviado exitosamente", token: supertoken });
            }
            catch (error) {
                console.error("Error al enviar el correo:", error);
                return res.status(500).json({ error: "Hubo un error al enviar el correo" });
            }
        });
    },
    validarToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.body;
                if (!token) {
                    return res.status(400).json({ error: "El token es requerido" });
                }
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "default_secret");
                const userId = decoded.userId;
                console.log("Token válido, usuario autenticado:", userId);
                return res.status(200).json({ message: "Autenticación exitosa", userId });
            }
            catch (error) {
                console.error("Error al validar el token:", error.message);
                return res.status(401).json({ error: "Token inválido o expirado" });
            }
        });
    }
};
exports.default = correoController;
