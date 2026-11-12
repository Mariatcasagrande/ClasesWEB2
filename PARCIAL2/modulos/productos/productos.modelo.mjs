import pool from '../../conexion.bd.mjs'

// Devuelve todos los productos.
export async function buscarTodos() {
    const resultado = await pool.query(
        'SELECT id, nombre, categoria, precio::float8 AS precio, stock FROM productos ORDER BY id',
    )

    return resultado.rows
}

// Devuelve un producto por id, o null si no existe.
export async function buscarPorId(id) {
    const resultado = await pool.query(
        'SELECT id, nombre, categoria, precio::float8 AS precio, stock FROM productos WHERE id = $1',
        [id],
    )

    return resultado.rows[0] || null
}
