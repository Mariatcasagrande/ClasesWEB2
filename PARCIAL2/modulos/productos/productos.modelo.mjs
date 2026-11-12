// ===========================================================================
// Modelo del módulo productos.
//
// Contiene las consultas SQL. No sabe nada de HTTP: devuelve filas o null.
// ===========================================================================

import pool from '../../conexion.bd.mjs'

// Columnas que se devuelven al front.
// - Es una constante fija (no viene del usuario), por eso es seguro incluirla
//   dentro del texto del SQL.
// - precio::float8 convierte el NUMERIC de PostgreSQL (que el driver entrega
//   como texto) en un número de JavaScript.
const CAMPOS_PRODUCTO = 'id, nombre, categoria, precio::float8 AS precio, stock'

// Devuelve todos los productos ordenados por id.
export async function buscarTodos() {
    const resultado = await pool.query(
        `SELECT ${CAMPOS_PRODUCTO} FROM productos ORDER BY id`,
    )

    return resultado.rows
}

// Devuelve un producto por id, o null si no existe.
// El id viaja como parámetro ($1) para evitar inyección SQL.
export async function buscarPorId(id) {
    const resultado = await pool.query(
        `SELECT ${CAMPOS_PRODUCTO} FROM productos WHERE id = $1`,
        [id],
    )

    return resultado.rows[0] || null
}
