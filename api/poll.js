// api/poll.js

global.estadoCliente = global.estadoCliente || { action: "espera" };

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        // 1. Tomamos el estado actual de la memoria
        const accionActual = global.estadoCliente.action;

        // 2. LA CLAVE: Si hay una orden (no está en espera), la entregamos y LIMPIAMOS de inmediato
        if (accionActual !== "espera") {
            global.estadoCliente.action = "espera"; // Se limpia solo aquí
        }

        // 3. Enviamos la respuesta a wait.html
        return res.status(200).json({ action: accionActual });
    }

    return res.status(405).json({ error: "Método no permitido" });
}