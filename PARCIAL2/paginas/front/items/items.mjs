const lista = document.querySelector('#lista')
const mensaje = document.querySelector('#mensaje')

async function cargarItems() {
    lista.replaceChildren()

    // Captura tanto errores de red como respuestas que no sean JSON válido.
    try {
        const respuesta = await fetch('/api/v1/productos')

        if (respuesta.status === 401) {
            window.location.href = '/login?error=sinsesion'
            return
        }

        const datos = await respuesta.json()

        if (!respuesta.ok) {
            mensaje.textContent = datos.error || 'No se pudieron cargar los ítems.'
            return
        }

        mensaje.textContent = ''

        for (const producto of datos) {
            const enlace = document.createElement('a')
            enlace.href = `/app/item/item.html?id=${producto.id}`
            enlace.textContent = producto.nombre

            const detalle = document.createElement('span')
            detalle.textContent = `${producto.categoria} · $${producto.precio} · stock: ${producto.stock}`

            const item = document.createElement('li')
            item.append(enlace, detalle)
            lista.append(item)
        }
    } catch (error) {
        console.error('Error al cargar los ítems:', error)
        mensaje.textContent = 'No se pudieron cargar los ítems. Revisá tu conexión e intentá nuevamente.'
    }
}

cargarItems()
