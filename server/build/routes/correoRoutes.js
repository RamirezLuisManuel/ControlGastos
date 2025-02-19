"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const correoController_1 = __importDefault(require("../controllers/correoController"));
const router = (0, express_1.Router)();
// Crear la ruta para el envío de correos
router.post('/enviar-correo', correoController_1.default.envioCorreo);
router.post('/validar-token', correoController_1.default.validarToken);
exports.default = router;
