const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Inicializamos la base de datos en memoria para este entorno local / de prueba
// Para persistencia, podríamos usar un archivo './washed.db' en lugar de ':memory:'
const dbPath = path.resolve(__dirname, 'washed.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Función para inicializar las tablas y meter datos de prueba (Seed Data)
const inicializarDB = () => {
    db.serialize(() => {
        // Creamos la tabla de PYMEs simuladas
        db.run(`CREATE TABLE IF NOT EXISTS pymes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            cuit TEXT UNIQUE NOT NULL,
            capacidad_maxima REAL NOT NULL,
            activa BOOLEAN DEFAULT 1
        )`, (err) => {
            if (err) console.error("Error creando tabla pymes:", err);
        });

        // Creamos la tabla de transacciones de "lavado" (asignaciones pendientes)
        db.run(`CREATE TABLE IF NOT EXISTS asignaciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pyme_id INTEGER,
            transaccion_id TEXT, -- Mapeo ciego (ej. "Transacción #849")
            monto_asignado REAL NOT NULL,
            retorno_pyme REAL NOT NULL,
            plazo_meses INTEGER NOT NULL,
            estado TEXT DEFAULT 'pendiente',
            FOREIGN KEY (pyme_id) REFERENCES pymes(id)
        )`, (err) => {
            if (err) console.error("Error creando tabla asignaciones:", err);
        });

        // Seed Data: Insertamos 10 PYMEs de prueba con capacidades variables (Requisito Phase 5)
        const checkDataQuery = `SELECT COUNT(*) AS count FROM pymes`;
        db.get(checkDataQuery, (err, row) => {
            if (!err && row.count === 0) {
                console.log("Cargando datos semilla (Seed Data) de PYMEs...");
                const stmt = db.prepare("INSERT INTO pymes (nombre, cuit, capacidad_maxima) VALUES (?, ?, ?)");
                
                // Generamos 10 PYMEs con capacidades aleatorias
                const capacidades = [50000, 150000, 80000, 30000, 250000, 10000, 120000, 45000, 90000, 200000];
                for (let i = 0; i < 10; i++) {
                    const cuitFicticio = `30-${Math.floor(Math.random() * 90000000 + 10000000)}-${Math.floor(Math.random() * 9)}`;
                    stmt.run(`Tintorería Ficticia ${i + 1}`, cuitFicticio, capacidades[i]);
                }
                stmt.finalize();
            }
        });
    });
};

module.exports = {
    db,
    inicializarDB
};
