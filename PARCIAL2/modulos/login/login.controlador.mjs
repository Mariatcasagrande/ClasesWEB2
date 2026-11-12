import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { buscarPorUsuario } from './login.modelo.mjs'
import { mostrarLogin, mostrarSesionIniciada, mostrarSesionCerrada } from './login.vista.mjs'

/*
 * Flujo de autenticación:
 *  1. Validar que lleguen usuario y pass, y que ambos sean texto.
 *     Si falta alguno, volver al login con un error genérico.
 *  2. Buscar el usuario en PostgreSQL con una consulta parametrizada.
 *  3. Si no existe, responder con el mismo error genérico para no revelar
 *     si falló el usuario o la contraseña.
 *  4. Comparar la contraseña escrita con password_hash usando bcrypt.compare.
 *  5. Si coincide, firmar un JWT de una hora y guardarlo en una cookie
 *     firmada, httpOnly y con vencimiento.
 *  6. Redirigir al listado de ítems.
 *
 * Cualquier error de la base, de bcrypt o del JWT se deriva con next(error)
 * al manejador de errores de index.mjs.
 */
export function autenticar(req, res, next) {
    const { usuario, pass } = req.body

    if (!usuario || !pass || typeof usuario !== 'string' || typeof pass !== 'string') {
        return mostrarLogin(res, 'usuarioincorrecto')
    }

    buscarPorUsuario(usuario, (error, usuarios) => {
        if (error) return next(error)

        if (usuarios.length === 0) {
            return mostrarLogin(res, 'usuarioincorrecto')
        }

        // Compara la contraseña escrita con el hash guardado en la base.
        bcrypt.compare(pass, usuarios[0].password_hash, (error, verificado) => {
            if (error) return next(error)

            if (!verificado) {
                return mostrarLogin(res, 'usuarioincorrecto')
            }

            // Firma el token con una hora de duración.
            jwt.sign(
                { usuario },
                process.env.CLAVE_PRIVADA,
                { expiresIn: '1h' },
                (error, token) => {
                    if (error) return mostrarLogin(res, 'errorjwt')
                    return mostrarSesionIniciada(res, token)
                },
            )
        })
    })
}

// GET /cerrar-sesion
export function cerrarSesion(req, res) {
    return mostrarSesionCerrada(res)
}
