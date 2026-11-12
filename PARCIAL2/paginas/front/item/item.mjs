const id = new URLSearchParams(window.location.search).get('id')
const titulo = document.querySelector('#titulo')
const detalle = document.querySelector('#detalle')
const mensaje = document.querySelector('#mensaje')

async function cargarItem() {
    if (!id) {
        mensaje.textContent = 'Falta el id en la URL.'
        return
    }

    // Captura tanto errores de red como respuestas que no sean JSON válido.
    try {
        const respuesta = await fetch(`/api/v1/productos/${id}`)

        if (respuesta.status === 401) {
            window.location.href = '/login?error=sinsesion'
            return
        }

        const datos = await respuesta.json()

        if (!respuesta.ok) {
            mensaje.textContent = datos.error || 'No se pudo cargar el ítem.'
            return
        }

        titulo.textContent = datos.nombre

        const filas = [
            ['ID', datos.id],
            ['Nombre', datos.nombre],
            ['Categoría', datos.categoria],
            ['Precio', datos.precio],
            ['Stock', datos.stock],
        ]

        for (const [etiqueta, valor] of filas) {
            const termino = document.createElement('dt')
            termino.textContent = etiqueta

            const definicion = document.createElement('dd')
            definicion.textContent = valor

            detalle.append(termino, definicion)
        }
    } catch (error) {
        console.error('Error al cargar el ítem:', error)
        mensaje.textContent = 'No se pudo cargar el ítem. Revisá tu conexión e intentá nuevamente.'
    }
}

cargarItem()
