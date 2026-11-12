// ===========================================================================
// Funciones del navegador para mostrar mensajes.
//
// Reciben el elemento donde se escribe el mensaje y el tipo (info o error).
// Así el mismo módulo sirve para el listado, el detalle y el procedimiento.
// ===========================================================================

export function mostrarMensaje(elemento, texto, tipo = 'info') {
    elemento.textContent = texto
    elemento.className = `mensaje visible ${tipo}`
}

export function mostrarError(elemento, texto) {
    mostrarMensaje(elemento, texto, 'error')
}

export function mostrarInfo(elemento, texto) {
    mostrarMensaje(elemento, texto, 'info')
}

export function ocultarMensaje(elemento) {
    elemento.textContent = ''
    elemento.className = 'mensaje'
}
