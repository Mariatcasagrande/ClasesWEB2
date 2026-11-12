import jwt from 'jsonwebtoken'
import { mostrarLogin } from '../modulos/login/login.vista.mjs'
import { mostrarError } from './respuestas.mjs'

/*Protege la API leyendo únicamente la cookie firmada por cookie-parser.
  Si no hay token válido, responde 401 en JSON para que el cliente pueda
  detectar que debe volver a iniciar sesión; si es válido, continúa la ruta.*/
export function protegerApi(req, res, next) {
    const token = req.signedCookies.token

    jwt.verify(token, process.env.CLAVE_PRIVADA, (error) => {
        if (error) return mostrarError(res, 401, 'Debe iniciar sesión.')
        return next()
    })
}

/* Protege las páginas estáticas con la misma validación de sesión.
   A diferencia de la API, una navegación de página se redirige al login.*/
export function protegerPaginas(req, res, next) {
    const token = req.signedCookies.token

    jwt.verify(token, process.env.CLAVE_PRIVADA, (error) => {
        if (error) return mostrarLogin(res, 'sinsesion')
        return next()
    })
}
