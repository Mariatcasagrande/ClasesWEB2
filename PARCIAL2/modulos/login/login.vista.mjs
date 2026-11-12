// ===========================================================================
// Vista del módulo login.
//
// La vista arma la respuesta HTTP: crea o borra la cookie, redirige o
// devuelve un error JSON. Así el controlador no repite detalles de Express.
// ===========================================================================

import dotenv from 'dotenv'

dotenv.config()

// Opciones de la cookie de sesión.
// - httpOnly: JavaScript del navegador no puede leerla.
// - secure: solo viaja por HTTPS; en desarrollo (HTTP) debe ser false.
// - sameSite: limita el envío de la cookie en peticiones de otros sitios.
// - signed: cookie-parser firma el valor con CLAVE_COOKIE, igual que en la
//   clase 21. Si el valor se modifica, la cookie se descarta.
const NOMBRE_COOKIE = process.env.NOMBRE_COOKIE || 'token_acceso'

// Opciones que definen la cookie más allá de su duración.
// Se comparten entre crear y borrar para que el navegador encuentre la misma
// cookie (mismo path, dominio, secure, sameSite y firma).
const opcionesBaseCookie = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    signed: true,
}

// Duración de la cookie en milisegundos.
// Se define en el código, no en .env, para que sea independiente de la
// expiración del JWT. Para cambiarla, modificá este valor.
// 1000 * 60 * 60 = 1 hora.
const DURACION_COOKIE_MS = 1000 * 60 * 60

// Al crear la cookie se agrega maxAge con esa duración.
const opcionesCookie = {
    ...opcionesBaseCookie,
    maxAge: DURACION_COOKIE_MS,
}

// Guarda el token en la cookie y manda al listado de ítems.
export function mostrarSesionIniciada(res, token) {
    res.cookie(NOMBRE_COOKIE, token, opcionesCookie)
    return res.redirect('/app/items/items.html')
}

// Cierra la sesión borrando la cookie.
// Según la documentación de Express, clearCookie recibe las mismas opciones
// que se usaron al crearla, excepto maxAge y expires: Express pone el
// vencimiento en el pasado para que el navegador la elimine.
export function mostrarSesionCerrada(res) {
    res.clearCookie(NOMBRE_COOKIE, opcionesBaseCookie)
    return res.redirect('/login')
}

// Redirige al login con un motivo en la query string.
// El front (login.mjs) lee ese motivo y muestra el mensaje correspondiente.
export function mostrarLogin(res, motivo) {
    return res.redirect(`/login?error=${motivo}`)
}

// Respuesta JSON genérica para errores de seguridad o de la API.
export function mostrarError(res, estado, mensaje) {
    return res.status(estado).json({ error: mensaje })
}
