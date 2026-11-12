// ===========================================================================
// Middlewares de seguridad.
//
// Un middleware es una función que recibe (req, res, next) y decide si la
// petición continúa (next()) o se corta con una respuesta.
//
// Se protegen dos tipos de acceso:
//   - protegerApi: endpoints de la API -> responde JSON 401.
//   - protegerPaginas: páginas privadas -> redirige al login.
//
// La credencial viaja en una cookie httpOnly con un JWT firmado. El navegador
// no puede leer esa cookie desde JavaScript, lo que reduce el riesgo de robo
// del token mediante XSS.
//
// Además, la cookie se firma con cookie-parser (opción signed: true). Hay dos
// firmas distintas:
//   1. la firma de la cookie, que detecta si alguien alteró su valor;
//   2. la firma del JWT, que detecta si alguien alteró su contenido.
// Por eso se lee desde req.signedCookies y no desde req.cookies.
// ===========================================================================

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { mostrarLogin, mostrarError } from '../modulos/login/login.vista.mjs'

dotenv.config()

const CLAVE = process.env.CLAVE_PRIVADA
const NOMBRE_COOKIE = process.env.NOMBRE_COOKIE || 'token_acceso'

// Seguridad para los endpoints.
export function protegerApi(req, res, next) {
    const token = req.signedCookies[NOMBRE_COOKIE]

    // Sin cookie no hay sesión: se corta con 401 Unauthorized.
    if (!token) {
        return mostrarError(res, 401, 'Debe iniciar sesión.')
    }

    // jwt.verify comprueba la firma y la fecha de expiración del token.
    jwt.verify(token, CLAVE, (error, datos) => {
        if (error) {
            return mostrarError(res, 401, 'Sesión inválida o expirada.')
        }

        // Se guardan los datos del token en la petición por si otro
        // middleware o controlador los necesita.
        req.usuario = datos
        return next()
    })
}

// Seguridad para las páginas.
export function protegerPaginas(req, res, next) {
    const token = req.signedCookies[NOMBRE_COOKIE]

    if (!token) {
        return mostrarLogin(res, 'sinsesion')
    }

    jwt.verify(token, CLAVE, (error) => {
        if (error) {
            return mostrarLogin(res, 'sesionexpirada')
        }

        return next()
    })
}
