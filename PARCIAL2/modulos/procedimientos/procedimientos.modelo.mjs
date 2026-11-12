import pool from '../../conexion.bd.mjs'

/*
 * Genera el reporte de balance desde la aplicación:
 *  1. Lee los productos y calcula en PostgreSQL subtotales y totales exactos.
 *  2. Arma el resultado que consume el controlador y la interfaz.
 *  3. Guarda el reporte en la misma transacción para no dejar datos parciales.
 *  4. Confirma la transacción y devuelve el reporte al callback.
 */
export function ejecutarBalance(callback) {
    pool.connect(async (errorConexion, cliente, liberar) => {
        if (errorConexion) return callback(errorConexion)

        let transaccionAbierta = false
        let errorFinal
        let reporte

        try {
            await cliente.query('BEGIN')
            transaccionAbierta = true

            const resultado = await cliente.query(`
                SELECT
                    id,
                    nombre,
                    categoria,
                    stock,
                    (precio * stock)::float8 AS subtotal,
                    COUNT(*) OVER()::int AS total_productos,
                    SUM(precio * stock) OVER()::float8 AS valor_total
                FROM productos
                ORDER BY id
            `)

            const filas = resultado.rows
            const totalProductos = filas[0]?.total_productos ?? 0
            const valorTotal = filas[0]?.valor_total ?? 0
            const detalle = filas.map(({ nombre, categoria, stock, subtotal }) => ({
                nombre,
                categoria,
                stock,
                subtotal,
            }))

            reporte = {
                proceso: 'Reporte de balance del inventario',
                totalProductos,
                valorTotal,
                detalle,
            }

            await cliente.query(
                `INSERT INTO reportes (total_productos, valor_total, detalle)
                 VALUES ($1, $2, $3::jsonb)`,
                [totalProductos, valorTotal, JSON.stringify(detalle)],
            )

            await cliente.query('COMMIT')
            transaccionAbierta = false
        } catch (errorConsulta) {
            errorFinal = errorConsulta

            if (transaccionAbierta) {
                try {
                    await cliente.query('ROLLBACK')
                } catch (errorRollback) {
                    console.error('No se pudo revertir la transacción del balance:', errorRollback)
                }
            }
        } finally {
            liberar()
        }

        if (errorFinal) return callback(errorFinal)
        return callback(null, reporte)
    })
}
