const express = require('express');
const cors = require('cors');
const path = require('path');
const { db, inicializarDB } = require('./database');
const { calcularDistribucion } = require('./reparto');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Permitir parsear JSON
app.use(express.static(path.join(__dirname, '../frontend'))); // Servir archivos estáticos del frontend

// Iniciar DB
inicializarDB();

// --- RUTAS DE LA API ---

// Endpoint para procesar el "depósito" y realizar el reparto
app.post('/api/depositar', (req, res) => {
    const { monto, metodo_pago } = req.body;
    
    // Validación básica: Monto debe ser mayor a 0
    if (!monto || monto <= 0) {
        return res.status(400).json({ error: "Monto inválido." });
    }

    // El requisito dice que el disparador de la fachada debe terminar en ".125"
    // Sin embargo, si es solo una simulación, podemos aceptarlo igual o validarlo:
    // Si la idea es mostrar cómo se ve el sistema por detrás, asumo que 
    // la request nos la manda el frontend una vez pasó la fachada.

    // Traemos las PYMEs activas de la base de datos para simular disponibilidad
    db.all(`SELECT * FROM pymes WHERE activa = 1`, [], (err, pymes) => {
        if (err) {
            return res.status(500).json({ error: "Error en la base de datos." });
        }

        // Ejecutamos el algoritmo de distribución
        const resultado = calcularDistribucion(monto, metodo_pago, pymes);

        // Capa Middleware Anónima: Generamos un ID de transacción ficticio
        const transaccionId = `Tx#${Math.floor(Math.random() * 9000 + 1000)}`;

        // Guardamos las asignaciones generadas en la base de datos
        // Insertamos cada asignación calculada por el algoritmo
        const stmt = db.prepare("INSERT INTO asignaciones (pyme_id, transaccion_id, monto_asignado, retorno_pyme, plazo_meses) VALUES (?, ?, ?, ?, ?)");
        
        resultado.asignaciones.forEach(asig => {
            stmt.run(asig.pyme_id, transaccionId, asig.monto_asignado, asig.retorno_pyme, resultado.plazo_meses);
        });
        
        stmt.finalize();

        // Respondemos con los datos para que el Frontend los visualice (Simulación)
        res.json({
            mensaje: "Distribución completada",
            transaccion_id: transaccionId,
            ...resultado
        });
    });
});

// Endpoint para simular el inicio de sesión de una PYME y ver sus saldos pendientes
app.get('/api/pyme/:cuit/saldo', (req, res) => {
    const { cuit } = req.params;
    
    // Buscamos la PYME mediante su CUIT
    db.get(`SELECT * FROM pymes WHERE cuit = ?`, [cuit], (err, pyme) => {
        if (err || !pyme) {
            return res.status(404).json({ error: "PYME no encontrada con ese CUIT." });
        }

        // Buscamos las asignaciones (deudas) pendientes de esta PYME
        db.all(`SELECT * FROM asignaciones WHERE pyme_id = ? AND estado = 'pendiente'`, [pyme.id], (err, asignaciones) => {
            if (err) {
                return res.status(500).json({ error: "Error leyendo asignaciones." });
            }

            res.json({
                pyme: pyme.nombre,
                asignaciones_pendientes: asignaciones
            });
        });
    });
});

// Endpoint para que la PYME pague su deuda pendiente simulando un juego
app.post('/api/pyme/pagar', (req, res) => {
    const { asignacion_id } = req.body;
    db.run(`UPDATE asignaciones SET estado = 'pagado' WHERE id = ?`, [asignacion_id], function(err) {
        if (err) {
            return res.status(500).json({ error: "Error al procesar pago." });
        }
        res.json({ mensaje: "Cuota pagada con éxito (Simulación completada)." });
    });
});

// Endpoint para que el cliente (Sr. Sucio) retire simulando un juego
app.post('/api/cliente/retirar', (req, res) => {
    const { transaccion_id } = req.body;
    db.run(`UPDATE asignaciones SET estado = 'retirado' WHERE transaccion_id = ?`, [transaccion_id], function(err) {
        if (err) {
            return res.status(500).json({ error: "Error al procesar retiro." });
        }
        res.json({ mensaje: "Dinero limpio retirado con éxito." });
    });
});

// Iniciar Servidor
app.listen(PORT, () => {
    console.log(`Servidor de simulación 'Washed' corriendo en http://localhost:${PORT}`);
});
