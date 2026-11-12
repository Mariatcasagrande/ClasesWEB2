import pool from '../../conexion.bd.mjs'

/*
 * Ejecuta la función generar_reporte_balance() definida en PostgreSQL.
 *
 * Esa función:
 *  1. Recorre la tabla productos.
 *  2. Calcula el subtotal de cada producto (precio * stock).
 *  3. Suma los subtotales para obtener el valor total del inventario.
 *  4. Inserta el reporte en la tabla reportes.
 *  5. Devuelve un JSON con el total de productos, el valor total y el detalle.
 *
 * Acá solo llamo a la función y devuelvo su resultado tal cual.
 */
export function ejecutarBalance(callback) {
    pool.query('SELECT generar_reporte_balance() AS reporte', (error, resultado) => {
        if (error) return callback(error)
        return callback(null, resultado.rows[0].reporte)
    })
}
