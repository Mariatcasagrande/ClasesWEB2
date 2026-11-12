// ===========================================================================
// Página de listado de ítems.
//
// Flujo:
//   1. pide la lista a la API;
//   2. si la respuesta no es correcta, muestra el error;
//   3. si está todo bien, arma un <li> por producto con un enlace a item.html.
//
// Este archivo está dentro de paginas/front/items/, por eso los módulos
// compartidos (api.mjs y mensajes.mjs) se importan con ../.
// ===========================================================================

import { cargarProductos } from '../api.mjs'
import { mostrarError, mostrarInfo, ocultarMensaje } from '../mensajes.mjs'

const lista = document.querySelector('#lista-items')
const mensaje = document.querySelector('#mensaje')

const formatoMoneda = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
})

// Crea el elemento visual de un producto.
// El enlace apunta a la página de detalle y le pasa el id por query string.
function crearItem(producto) {
    const elemento = document.createElement('li')

    const enlace = document.createElement('a')
    enlace.href = `/app/item/item.html?id=${producto.id}`
    enlace.textContent = producto.nombre

    const meta = document.createElement('span')
    meta.className = 'meta'
    meta.textContent = `${producto.categoria} · ${formatoMoneda.format(producto.precio)} · stock: ${producto.stock}`

    elemento.append(enlace, meta)
    return elemento
}

async function mostrarItems() {
    try {
        const respuesta = await cargarProductos()
        const datos = await respuesta.json()

        // La API puede responder 400, 401, 404 o 500.
        if (!respuesta.ok) {
            return mostrarError(mensaje, datos.error || 'No se pudieron cargar los ítems.')
        }

        if (datos.length === 0) {
            return mostrarInfo(mensaje, 'No hay productos para mostrar.')
        }

        // replaceChildren reemplaza la lista completa para no duplicar ítems.
        lista.replaceChildren(...datos.map(crearItem))
        ocultarMensaje(mensaje)
    } catch (error) {
        // Error de red o JSON inválido.
        console.error(error)
        mostrarError(mensaje, 'No se pudieron cargar los ítems.')
    }
}

mostrarItems()
