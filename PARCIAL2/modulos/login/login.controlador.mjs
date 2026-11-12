// ===========================================================================
// Controlador del módulo login.
//
// Recibe la petición, valida los datos, consulta el modelo, verifica la
// contraseña con bcryptjs y genera el JWT. No escribe SQL ni arma HTML.
// ===========================================================================

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { buscarPorUsuario } from './login.modelo.mjs'
import { mostrarSesionIniciada, mostrarSesionCerrada, mostrarLogin } from './login.vista.mjs'

dotenv.config()

// POST /autenticacion
export async function autenticar(req, res, next) {
    const { usuario, pass } = req.body

    // Si falta alguno de los dos datos ni siquiera consulto la base.
    if (!usuario || !pass) {
        return mostrarLogin(res, 'usuarioincorrecto')
    }

    // Lo que puede fallar (la consulta a la base, bcrypt) cae en el catch
    // y se lo paso al manejador de errores del index.
    try {
        const usuarios = await buscarPorUsuario(usuario)

        // No existe el usuario.
        if (usuarios.length === 0) {
            return mostrarLogin(res, 'usuarioincorrecto')
        }

        // La base guarda el hash, nunca la contraseña en texto plano.
        // bcrypt.compare vuelve a hashear el valor recibido y compara.
        const verificado = await bcrypt.compare(pass, usuarios[0].password_hash)

        if (!verificado) {
            return mostrarLogin(res, 'usuarioincorrecto')
        }

        // Se firma el token con la clave secreta del .env.
        // El token incluye el nombre de usuario y una fecha de expiración.
        jwt.sign(
            { usuario },
            process.env.CLAVE_PRIVADA,
            { expiresIn: Number(process.env.JWT_EXPIRACION_SEGUNDOS) || 3600 },
            (error, token) => {
                if (error) {
                    return next(error)
                }

                // La vista guarda el token en la cookie y redirige al listado.
                return mostrarSesionIniciada(res, token)
            },
        )
    } catch (error) {
        return next(error)
    }
}

// GET /cerrar-sesion
export function cerrarSesion(req, res) {
    return mostrarSesionCerrada(res)
}
