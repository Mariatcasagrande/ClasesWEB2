const opcionesCookie = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    signed: true,
    maxAge: 1000 * 60 * 60, // Una hora.
}

// Guarda el token en la cookie y va al listado.
export function mostrarSesionIniciada(res, token) {
    res.cookie('token', token, opcionesCookie)
    return res.redirect('/app/items/items.html')
}

// Borra la cookie con las mismas opciones y vuelve al login.
export function mostrarSesionCerrada(res) {
    res.clearCookie('token', opcionesCookie)
    return res.redirect('/login')
}

// Vuelve al login con un motivo para mostrar el mensaje.
export function mostrarLogin(res, motivo) {
    return res.redirect(`/login?error=${motivo}`)
}

// Respuesta JSON para errores de la API.
export function mostrarError(res, estado, mensaje) {
    return res.status(estado).json({ error: mensaje })
}
