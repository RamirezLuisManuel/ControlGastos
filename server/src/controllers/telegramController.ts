import { Request, Response } from 'express';
import TelegramBot from 'node-telegram-bot-api';
import keys from '../keys';

const bot = new TelegramBot(keys.telegramConfig.apiKey, { polling: true });

const processUserMessage = (chatId: number, text: string): { responseMessage: string; shouldRedirect: boolean; redirectUrl?: string } => {
    let responseMessage = '';
    let shouldRedirect = false;
    let redirectUrl: string | undefined;

    if (text === '/start') {
        responseMessage = `¡Hola! Soy tu asistente de control de gastos. ¿En qué puedo ayudarte? Tu chat ID es: ${chatId}`;
    } else if (/crear un gasto|agregar un gasto|añadir un gasto/i.test(text)) {
        responseMessage = `¡Entendido! Redirigiendo a la página de creación de gastos.`;
        shouldRedirect = true;
        redirectUrl = '/gastos/add';
    } else if (/ver mis gastos|muestra mis gastos|enséñame mis gastos/i.test(text)) {
        responseMessage = `¡Entendido! Redirigiendo a la página del listado de gastos.`;
        shouldRedirect = true;
        redirectUrl = '/gastos/list';
    } else if (/crear un ingreso|agregar un ingreso|añadir un ingreso/i.test(text)) {
        responseMessage = `¡Entendido! Redirigiendo a la página de creación de ingresos.`;
        shouldRedirect = true;
        redirectUrl = '/ingresos/add';
    } else if (/ver mis ingresos|muestra mis ingresos|enséñame mis ingresos/i.test(text)) {
        responseMessage = `¡Entendido! Redirigiendo a la página del listado de ingresos.`;
        shouldRedirect = true;
        redirectUrl = '/ingresos/list';
    } else if (/crear un servicio|agregar un servicio|añadir un servicio/i.test(text)) {
        responseMessage = `¡Entendido! Redirigiendo a la página de creación de servicios.`;
        shouldRedirect = true;
        redirectUrl = '/servicios/add';
    } else if (/ver mis servicios|muestra mis servicios|enséñame mis servicios/i.test(text)) {
        responseMessage = `¡Entendido! Redirigiendo a la página del listado de servicios.`;
        shouldRedirect = true;
        redirectUrl = '/servicios/list';
    } else if (/ver mi resumen|muestra mi resumen|enséñame mi resumen/i.test(text)) {
        responseMessage = `¡Entendido! Redirigiendo a la página del resumen.`;
        shouldRedirect = true;
        redirectUrl = '/resumen';
    } else {
        responseMessage = `Lo siento, no entiendo el mensaje. Intenta con otro comando. Tu chat ID es: ${chatId}`;
    }

    bot.sendMessage(chatId, responseMessage);
    return { responseMessage, shouldRedirect, redirectUrl };
};


export const initializeTelegramBot = () => {
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const text = (msg.text || '').toLowerCase();
        processUserMessage(chatId, text);
    });
};

export const simulateUserMessage = (req: Request, res: Response) => {
    const { chatId, message } = req.body;
    try {
        const { responseMessage, shouldRedirect } = processUserMessage(chatId, message.toLowerCase());

        res.json({ success: true, message: responseMessage, redirect: shouldRedirect });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error procesando el mensaje simulado' });
    }
};
