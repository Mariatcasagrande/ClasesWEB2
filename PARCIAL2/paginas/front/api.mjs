// ===========================================================================
// Acceso a la API desde el navegador.
//
// Centraliza las URLs y el tratamiento del 401. Si la cookie venció o no
// existe, el usuario vuelve al login en lugar de quedar en una página vacía.
// ===========================================================================

const URL_PRODUCTOS = '/api/v1/productos'
const URL_PROCEDIMIENTO = '/api/v1/procedimiento/balance'

async function consultarAPI(url) {
    const respuesta = await fetch(url)

    // 401: la sesión no es válida o venció.
    if (respuesta.status === 401) {
        window.location.replace('/login?error=sinsesion')
    }

    return respuesta
}

// Lista completa de productos.
export function cargarProductos() {
    return consultarAPI(URL_PRODUCTOS)
}

// Un producto por id. encodeURIComponent evita que un id raro rompa la URL.
export function cargarProducto(id) {
    return consultarAPI(`${URL_PRODUCTOS}/${encodeURIComponent(id)}`)
}

// Ejecuta el procedimiento almacenado.
export function ejecutarProcedimiento() {
    return consultarAPI(URL_PROCEDIMIENTO)
}
