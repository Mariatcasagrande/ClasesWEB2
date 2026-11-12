// ===========================================================================
// Script de la página de login.
//
// El backend redirige a /login?error=... cuando falla el inicio de sesión.
// Este script lee ese parámetro y muestra el mensaje correspondiente.
// ===========================================================================

const mensaje = document.querySelector('#mensaje')
const parametros = new URLSearchParams(window.location.search)

// Motivos que puede enviar el backend en la query string.
const errores = {
    usuarioincorrecto: 'Usuario o contraseña incorrectos.',
    sinsesion: 'Debe iniciar sesión para acceder a esa página.',
    sesionexpirada: 'Su sesión expiró. Vuelva a iniciar sesión.',
}

const error = parametros.get('error')

if (error) {
    mensaje.textContent = errores[error] || 'No se pudo iniciar sesión.'
    mensaje.classList.add('visible', 'error')
}

// Deja el cursor listo en el campo de usuario.
document.querySelector('#usuario').focus()
