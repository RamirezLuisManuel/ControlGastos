"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true para el puerto 465, false para otros puertos
    auth: {
        user: "luismanuelr245@gmail.com", // Correo Emisor
        pass: "koon kkua inwp avjc", //Contraseña de aplicacion
    },
    tls: {
        rejectUnauthorized: false,
    },
});
// Verifica el transporte
exports.transporter
    .verify()
    .then(() => {
    console.log("Listo para envío de correos");
})
    .catch((err) => {
    // Corrección de tipo
    console.error("Error al verificar el transporte:", err);
});
