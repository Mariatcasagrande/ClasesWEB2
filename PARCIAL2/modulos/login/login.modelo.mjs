import pool from '../../conexion.bd.mjs'

// Busca el usuario por nombre. El valor va como parámetro para evitar inyección SQL.
export async function buscarPorUsuario(usuario) {
    const resultado = await pool.query(
        'SELECT id, username, password_hash FROM usuarios WHERE username = $1',
        [usuario],
    )

    return resultado.rows
}
