const boton = document.querySelector('#boton')
const estado = document.querySelector('#estado')
const resultado = document.querySelector('#resultado')
const tabla = document.querySelector('#tabla')
const cuerpo = document.querySelector('#cuerpo')
const resumen = document.querySelector('#resumen')
const totalProductos = document.querySelector('#total-productos')
const valorTotal = document.querySelector('#valor-total')

boton.addEventListener('click', async () => {
    boton.disabled = true
    estado.textContent = 'Ejecutando...'
    resultado.textContent = ''
    cuerpo.replaceChildren()
    tabla.classList.add('oculto')
    resumen.classList.add('oculto')

    // El finally habilita otra ejecución también si falla la red o el parseo.
    try {
        const respuesta = await fetch('/api/v1/procedimiento/balance')

        if (respuesta.status === 401) {
            window.location.href = '/login?error=sinsesion'
            return
        }

        const datos = await respuesta.json()

        if (!respuesta.ok || datos.exito !== true) {
            estado.textContent = datos.error || 'No se pudo ejecutar el procedimiento.'
            return
        }

        estado.textContent = 'El procedimiento se ejecutó correctamente.'
        resultado.textContent = JSON.stringify(datos.resultado, null, 2)

        totalProductos.textContent = datos.resultado.totalProductos
        valorTotal.textContent = `$ ${Number(datos.resultado.valorTotal).toLocaleString('es-AR')}`
        resumen.classList.remove('oculto')

        for (const fila of datos.resultado.detalle) {
            const tr = document.createElement('tr')
            const valores = [
                fila.nombre,
                fila.categoria,
                fila.stock,
                `$ ${Number(fila.subtotal).toLocaleString('es-AR')}`,
            ]

            for (const valor of valores) {
                const td = document.createElement('td')
                td.textContent = valor
                tr.append(td)
            }

            cuerpo.append(tr)
        }

        tabla.classList.remove('oculto')
    } catch (error) {
        console.error('Error al ejecutar el procedimiento:', error)
        estado.textContent = 'No se pudo completar la operación. Revisá tu conexión e intentá nuevamente.'
    } finally {
        boton.disabled = false
    }
})
