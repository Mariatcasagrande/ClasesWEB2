import jwt from 'jsonwebtoken'
import { mostrarLogin, mostrarError } from '../modulos/login/login.vista.mjs'

// Seguridad para los endpoints.
export function protegerApi(req, res, next) {
    const token = req.signedCookies.token

    jwt.verify(token, process.env.CLAVE_PRIVADA, (error) => {
        if (error) return mostrarError(res, 401, 'Debe iniciar sesión.')
        return next()
    })
}

// Seguridad para las páginas.
export function protegerPaginas(req, res, next) {
    const token = req.signedCookies.token

    jwt.verify(token, process.env.CLAVE_PRIVADA, (error) => {
        if (error) return mostrarLogin(res, 'sinsesion')
        return next()
    })
}
