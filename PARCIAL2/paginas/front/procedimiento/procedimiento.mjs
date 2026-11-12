// ===========================================================================
// Página del procedimiento.
//
// Flujo:
//   1. el usuario presiona el botón;
//   2. se deshabilita el botón mientras se ejecuta;
//   3. se llama a la API;
//   4. si sale bien, se muestran el JSON y la tabla de detalle;
//   5. si falla, se muestra un mensaje de error.
//
// Este archivo está dentro de paginas/front/procedimiento/, por eso los
// módulos compartidos (api.mjs y mensajes.mjs) se importan con ../.
// ===========================================================================

import { ejecutarProcedimiento } from '../api.mjs'
import { mostrarMensaje, mostrarError, ocultarMensaje } from '../mensajes.mjs'

const boton = document.querySelector('#boton-procedimiento')
const estado = document.querySelector('#estado')
const resultado = document.querySelector('#resultado')
const tabla = document.querySelector('#tabla-detalle')
const cuerpoTabla = document.querySelector('#cuerpo-detalle')

const formatoMoneda = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
})

// Arma una fila de la tabla por cada producto del reporte.
function dibujarTabla(detalle) {
    cuerpoTabla.replaceChildren()

    if (!detalle || detalle.length === 0) {
        tabla.classList.add('oculto')
        return
    }

    for (const fila of detalle) {
        const tr = document.createElement('tr')

        for (const valor of [fila.nombre, fila.categoria, fila.stock, formatoMoneda.format(fila.subtotal)]) {
            const celda = document.createElement('td')
            celda.textContent = valor
            tr.append(celda)
        }

        cuerpoTabla.append(tr)
    }

    tabla.classList.remove('oculto')
}

async function ejecutar() {
    // Evita dobles clics y da feedback mientras se espera la respuesta.
    boton.disabled = true
    boton.textContent = 'Ejecutando...'
    resultado.textContent = ''
    cuerpoTabla.replaceChildren()
    tabla.classList.add('oculto')
    mostrarMensaje(estado, 'Ejecutando el procedimiento...')

    try {
        const respuesta = await ejecutarProcedimiento()
        const datos = await respuesta.json()

        // La API responde { exito: true, resultado } o { error: '...' }.
        if (!respuesta.ok || !datos.exito) {
            throw new Error(datos.error || `La API respondió con el estado ${respuesta.status}.`)
        }

        // En éxito se oculta el estado y se muestran los datos devueltos.
        // Así el usuario ve el resultado real del procedimiento.
        ocultarMensaje(estado)
        resultado.textContent = JSON.stringify(datos.resultado, null, 2)
        dibujarTabla(datos.resultado.detalle)
    } catch (error) {
        console.error(error)
        mostrarError(estado, `No se pudo ejecutar el procedimiento: ${error.message}`)
    } finally {
        // Pase lo que pase, el botón vuelve a quedar disponible.
        boton.disabled = false
        boton.textContent = 'Ejecutar procedimiento'
    }
}

boton.addEventListener('click', ejecutar)
