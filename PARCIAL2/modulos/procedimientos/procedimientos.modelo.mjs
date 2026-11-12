import pool from '../../conexion.bd.mjs'

// Ejecuta la función de PostgreSQL y devuelve el reporte.
export function ejecutarBalance(callback) {
    pool.query('SELECT generar_reporte_balance() AS reporte', (error, resultado) => {
        if (error) return callback(error)
        return callback(null, resultado.rows[0].reporte)
    })
}
