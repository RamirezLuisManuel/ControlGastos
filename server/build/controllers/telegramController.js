"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateUserMessage = exports.initializeTelegramBot = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const keys_1 = __importDefault(require("../keys"));
const bot = new node_telegram_bot_api_1.default(keys_1.default.telegramConfig.apiKey, { polling: true });
const processUserMessage = (chatId, text) => {
    let responseMessage = '';
    let shouldRedirect = false;
    let redirectUrl;
    if (text === '/start') {
        responseMessage = `¡Hola! Soy tu asistente de control de gastos. ¿En qué puedo ayudarte? Tu chat ID es: ${chatId}`;
    }
    else if (/crear un gasto|agregar un gasto|añadir un gasto/i.test(text)) {
        responseMessage = `¡Entendido! Redirigiendo a la página de creación de gastos.`;
        shouldRedirect = true;
        redirectUrl = '/gastos/add';
    }
    else if (/ver mis gastos|muestra mis gastos|enséñame mis gastos/i.test(text)) {
        responseMessage = `¡Entendido! Redirigiendo a la página del listado de gastos.`;
        shouldRedirect = true;
        redirectUrl = '/gastos/list';
    }
    else if (/crear un ingreso|agregar un ingreso|añadir un ingreso/i.test(text)) {
        responseMessage = `¡Entendido! Redirigiendo a la página de creación de ingresos.`;
        shouldRedirect = true;
        redirectUrl = '/ingresos/add';
    }
    else if (/ver mis ingresos|muestra mis ingresos|enséñame mis ingresos/i.test(text)) {
        responseMessage = `¡Entendido! Redirigiendo a la página del listado de ingresos.`;
        shouldRedirect = true;
        redirectUrl = '/ingresos/list';
    }
    else if (/crear un servicio|agregar un servicio|añadir un servicio/i.test(text)) {
        responseMessage = `¡Entendido! Redirigiendo a la página de creación de servicios.`;
        shouldRedirect = true;
        redirectUrl = '/servicios/add';
    }
    else if (/ver mis servicios|muestra mis servicios|enséñame mis servicios/i.test(text)) {
        responseMessage = `¡Entendido! Redirigiendo a la página del listado de servicios.`;
        shouldRedirect = true;
        redirectUrl = '/servicios/list';
    }
    else if (/ver mi resumen|muestra mi resumen|enséñame mi resumen/i.test(text)) {
        responseMessage = `¡Entendido! Redirigiendo a la página del resumen.`;
        shouldRedirect = true;
        redirectUrl = '/resumen';
    }
    else {
        responseMessage = `Lo siento, no entiendo el mensaje. Intenta con otro comando. Tu chat ID es: ${chatId}`;
    }
    bot.sendMessage(chatId, responseMessage);
    return { responseMessage, shouldRedirect, redirectUrl };
};
const initializeTelegramBot = () => {
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const text = (msg.text || '').toLowerCase();
        processUserMessage(chatId, text);
    });
};
exports.initializeTelegramBot = initializeTelegramBot;
const simulateUserMessage = (req, res) => {
    const { chatId, message } = req.body;
    try {
        const { responseMessage, shouldRedirect } = processUserMessage(chatId, message.toLowerCase());
        res.json({ success: true, message: responseMessage, redirect: shouldRedirect });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Error procesando el mensaje simulado' });
    }
};
exports.simulateUserMessage = simulateUserMessage;
