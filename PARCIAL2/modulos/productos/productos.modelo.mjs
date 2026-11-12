import pool from '../../conexion.bd.mjs'

// Devuelve todos los productos.
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
