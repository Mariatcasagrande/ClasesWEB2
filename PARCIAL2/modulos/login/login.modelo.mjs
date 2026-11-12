// ===========================================================================
// Modelo del módulo login.
//
// El modelo es la única capa que habla con PostgreSQL. No conoce Express ni
// arma respuestas HTTP: solo devuelve datos.
// ===========================================================================

import pool from '../../conexion.bd.mjs'

// Busca un usuario por su nombre.
// Devuelve un arreglo con las filas encontradas (vacío si no existe).
//
// El valor llega como parámetro ($1) en lugar de concatenarse dentro del SQL.
// Eso evita una inyección SQL: PostgreSQL trata el valor como dato, no como
// parte de la sentencia.
export async function buscarPorUsuario(usuario) {
    const resultado = await pool.query(
        'SELECT id, username, password_hash FROM usuarios WHERE username = $1',
        [usuario],
    )

    return resultado.rows
}
