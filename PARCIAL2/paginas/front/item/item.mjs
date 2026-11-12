// ===========================================================================
// Página de detalle de un ítem.
//
// El id llega por query string (item.html?id=2). El front lo usa para pedir
// ese producto al endpoint /api/v1/productos/:id y dibujar sus datos.
//
// Este archivo está dentro de paginas/front/item/, por eso los módulos
// compartidos (api.mjs y mensajes.mjs) se importan con ../.
// ===========================================================================

import { cargarProducto } from '../api.mjs'
import { mostrarError, ocultarMensaje } from '../mensajes.mjs'

const parametros = new URLSearchParams(window.location.search)
const id = parametros.get('id')

const titulo = document.querySelector('#titulo-item')
const detalle = document.querySelector('#detalle')
const mensaje = document.querySelector('#mensaje')

const formatoMoneda = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
})

// Agrega un par etiqueta/valor a la lista de definiciones (<dl>).
function agregarDato(etiqueta, valor) {
    const termino = document.createElement('dt')
    termino.textContent = etiqueta

    const definicion = document.createElement('dd')
    definicion.textContent = valor

    detalle.append(termino, definicion)
}

async function mostrarItem() {
    // Si no vino el id, no tiene sentido consultar la API.
    if (!id) {
        mostrarError(mensaje, 'Falta el parámetro "id" en la URL. Volvé al listado y elegí un ítem.')
        return
    }

    try {
        const respuesta = await cargarProducto(id)
        const datos = await respuesta.json()

        // 400 (id inválido), 404 (no existe) o 500 (error del servidor).
        if (!respuesta.ok) {
            return mostrarError(mensaje, datos.error || 'No se pudo cargar el ítem.')
        }

        titulo.textContent = datos.nombre
        document.title = `${datos.nombre} · Ítem`

        agregarDato('ID', datos.id)
        agregarDato('Nombre', datos.nombre)
        agregarDato('Categoría', datos.categoria)
        agregarDato('Precio', formatoMoneda.format(datos.precio))
        agregarDato('Stock', datos.stock)

        ocultarMensaje(mensaje)
    } catch (error) {
        console.error(error)
        mostrarError(mensaje, 'No se pudo cargar el ítem.')
    }
}

mostrarItem()
