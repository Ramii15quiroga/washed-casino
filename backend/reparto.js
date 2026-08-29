// Lógica conceptual de distribución (Algoritmo de Fragmentación y Reparto)
function calcularDistribucion(montoTotal, metodoPago, pymesDisponibles) {
    // 1. Comisión de la plataforma (1% virtual, 0.65% efectivo)
    const comisionWeb = metodoPago === "Virtual" ? 0.01 : 0.0065;
    const montoPostWeb = montoTotal * (1 - comisionWeb);
    
    let montoRestante = montoPostWeb;
    const asignaciones = [];
    
    // 2. Fragmentación según capacidad de PYMEs (no uniforme)
    // Recorremos las pymes para asignarles fracciones de dinero hasta que no quede monto
    for (let pyme of pymesDisponibles) {
        if (montoRestante <= 0) break; // Si ya lavamos todo el dinero, salimos

        // Calculamos una fracción basada en la capacidad máxima de la PYME (entre 70% y 100%)
        let fraccion = pyme.capacidad_maxima * (Math.random() * (1.0 - 0.7) + 0.7);
        
        // No asignamos más de lo que nos queda por lavar
        if (fraccion > montoRestante) {
            fraccion = montoRestante;
        }

        // La PYME se queda con el 10% de lo que procesa (comisión PYME)
        const comisionPyme = fraccion * 0.10;
        
        // Guardamos los datos de la asignación generada
        asignaciones.push({
            pyme_id: pyme.id,
            nombre: pyme.nombre, // Referencia para el frontend
            monto_asignado: parseFloat(fraccion.toFixed(2)),
            retorno_pyme: parseFloat(comisionPyme.toFixed(2))
        });

        montoRestante -= fraccion; // Restamos del pozo total restante
    }
    
    // 3. Matriz de Tiempos y Plazos (Cola de Espera)
    // Plazo base 1, más el ratio de monto a pymes con un factor estacional arbitrario
    const disponibilidadPymes = pymesDisponibles.length || 1;
    const factorEstacional = 0.005; // Ajuste para mantener la escala entre 1 y 6
    let plazoMeses = 1 + (montoTotal / disponibilidadPymes) * factorEstacional;

    // Escala: Ajustar variable entre 1 mes y 6 meses (como dice la documentación)
    plazoMeses = Math.max(1, Math.min(6, Math.round(plazoMeses)));

    return {
        monto_original: montoTotal,
        monto_a_lavar: montoPostWeb,
        comision_web: comisionWeb,
        asignaciones: asignaciones,
        plazo_meses: plazoMeses,
        sobrante: montoRestante > 0 ? parseFloat(montoRestante.toFixed(2)) : 0
    };
}

module.exports = {
    calcularDistribucion
};
