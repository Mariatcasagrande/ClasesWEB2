import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { buscarPorUsuario } from './login.modelo.mjs'
import { mostrarLogin, mostrarSesionIniciada, mostrarSesionCerrada } from './login.vista.mjs'

dotenv.config()

// POST /autenticacion
export async function autenticar(req, res, next) {
    const { usuario, pass } = req.body

    if (!usuario || !pass) {
        return mostrarLogin(res, 'usuarioincorrecto')
    }

    try {
        const usuarios = await buscarPorUsuario(usuario)

        if (usuarios.length === 0) {
            return mostrarLogin(res, 'usuarioincorrecto')
        }

        // Compara la contraseña escrita con el hash guardado en la base.
        const verificado = await bcrypt.compare(pass, usuarios[0].password_hash)

        if (!verificado) {
            return mostrarLogin(res, 'usuarioincorrecto')
        }

        // Firma el token con una hora de duración.
        jwt.sign(
            { usuario },
            process.env.CLAVE_PRIVADA,
            { expiresIn: '1h' },
            (error, token) => {
                if (error) {
                    return mostrarLogin(res, 'errorjwt')
                }
                return mostrarSesionIniciada(res, token)
            },
        )
    } catch (error) {
        next(error)
    }
}

// GET /cerrar-sesion
export function cerrarSesion(req, res) {
    return mostrarSesionCerrada(res)
}
