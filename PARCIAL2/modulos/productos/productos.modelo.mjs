import pool from '../../conexion.bd.mjs'

/*
 * Alinea la secuencia SERIAL con los ids de los productos iniciales insertados
 * desde SQL. Se ejecuta al iniciar el servidor para que los próximos ids no
 * colisionen con esos registros.
 */
export function sincronizarSecuenciaProductos(callback) {
    pool.query(
        `SELECT setval(
            pg_get_serial_sequence('productos', 'id'),
            COALESCE(MAX(id), 1),
            MAX(id) IS NOT NULL
        )
        FROM productos`,
        (error) => {
            if (error) return callback(error)
            return callback(null)
        },
    )
}

// Devuelve todos los productos ordenados por id.
// precio::float8 hace que PostgreSQL devuelva un número y no un texto decimal.
export function buscarTodos(callback) {
    pool.query(
        'SELECT id, nombre, categoria, precio::float8 AS precio, stock FROM productos ORDER BY id',
        (error, resultado) => {
            if (error) return callback(error)
            return callback(null, resultado.rows)
        },
    )
}

// Devuelve un producto por id, o null si no existe.
// El id va como parámetro ($1) para evitar inyección SQL.
export function buscarPorId(id, callback) {
    pool.query(
        'SELECT id, nombre, categoria, precio::float8 AS precio, stock FROM productos WHERE id = $1',
        [id],
        (error, resultado) => {
            if (error) return callback(error)
            return callback(null, resultado.rows[0] || null)
        },
    )
}
