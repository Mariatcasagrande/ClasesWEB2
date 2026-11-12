import pool from '../../conexion.bd.mjs'

// Busca el usuario por nombre. El valor va como parámetro para evitar inyección SQL.
export function buscarPorUsuario(usuario, callback) {
    pool.query(
        'SELECT id, username, password_hash FROM usuarios WHERE username = $1',
        [usuario],
        (error, resultado) => {
            if (error) return callback(error)
            return callback(null, resultado.rows)
        },
    )
}
