import pool from '../../conexion.bd.mjs'

// Ejecuta la función de PostgreSQL y devuelve el reporte.
export async function ejecutarBalance() {
    const resultado = await pool.query('SELECT generar_reporte_balance() AS reporte')

    return resultado.rows[0].reporte
}
