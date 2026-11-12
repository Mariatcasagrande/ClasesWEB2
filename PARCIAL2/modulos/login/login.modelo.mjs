import pool from '../../conexion.bd.mjs'

/*Busca un usuario por su nombre.
  Devuelve un arreglo con las filas encontradas: vacío si el usuario no existe.*/
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
