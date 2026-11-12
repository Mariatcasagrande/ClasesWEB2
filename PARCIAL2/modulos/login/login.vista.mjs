// Opciones que comparten la creación y el borrado de la cookie.
const opcionesCookie = {
    httpOnly: true,
    // En producción la cookie viaja solo por HTTPS. En desarrollo/localhost
    // queda en false para que el navegador la guarde también por HTTP.
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    signed: true,
}

// Guarda el token en una cookie firmada de una hora y redirige al listado.
export function mostrarSesionIniciada(res, token) {
    res.cookie('token', token, {
        ...opcionesCookie,
        maxAge: 1000 * 60 * 60, // Una hora, igual que el expiresIn del JWT.
    })
    return res.redirect('/app/items/items.html')
}

// Borra la cookie con las mismas opciones base y vuelve al login.
export function mostrarSesionCerrada(res) {
    res.clearCookie('token', opcionesCookie)
    return res.redirect('/login')
}

// Vuelve al login con un motivo en la URL para que la vista muestre el mensaje.
export function mostrarLogin(res, motivo) {
    return res.redirect(`/login?error=${motivo}`)
}
