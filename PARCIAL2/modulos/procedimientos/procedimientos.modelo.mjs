// ===========================================================================
// Modelo del módulo procedimientos.
//
// Ejecuta la función almacenada en PostgreSQL. La lógica del procedimiento
// vive en la base de datos (ver sql/base_datos.sql).
// ===========================================================================

import pool from '../../conexion.bd.mjs'

// Llama a generar_reporte_balance() y devuelve el JSONB que retorna.
export async function ejecutarBalance() {
    const resultado = await pool.query(
        'SELECT generar_reporte_balance() AS reporte',
    )

    return resultado.rows[0].reporte
}
