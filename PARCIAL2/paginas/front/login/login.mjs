const mensaje = document.querySelector('#mensaje')
const error = new URLSearchParams(window.location.search).get('error')

if (error === 'sinsesion') {
    mensaje.textContent = 'Tenés que iniciar sesión.'
} else if (error === 'usuarioincorrecto') {
    mensaje.textContent = 'Usuario o contraseña incorrectos.'
} else if (error === 'errorjwt') {
    mensaje.textContent = 'No se pudo iniciar sesión.'
}

document.querySelector('input[name="usuario"]').focus()
