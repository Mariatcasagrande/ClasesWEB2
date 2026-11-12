// ===========================================================================
// Controlador del módulo productos.
//
// Valida los parámetros de la petición, llama al modelo y elige la respuesta
// a través de la vista. Los errores inesperados se delegan con next(error).
// ===========================================================================

import { buscarTodos, buscarPorId } from './productos.modelo.mjs'
import { mostrarProductos, mostrarProducto, mostrarError } from './productos.vista.mjs'

// Convierte el id que llega por URL (siempre texto) a un entero positivo.
// Devuelve null si el dato no es válido.
function verificarId(valor) {
    const id = Number(valor)
    return Number.isInteger(id) && id > 0 ? id : null
}

// GET /api/v1/productos
export async function obtenerProductos(req, res, next) {
    try {
        const productos = await buscarTodos()
        return mostrarProductos(res, productos)
    } catch (error) {
        // Error inesperado (por ejemplo, la base no responde).
        return next(error)
    }
}

// GET /api/v1/productos/:id
export async function obtenerProductoPorId(req, res, next) {
    const id = verificarId(req.params.id)

    // Si el id no es un entero positivo, el error es del cliente: 400.
    if (id === null) {
        return mostrarError(res, 400, 'El id debe ser un número entero positivo.')
    }

    try {
        const producto = await buscarPorId(id)

        // El recurso pedido no existe: 404.
        if (!producto) {
            return mostrarError(res, 404, 'No se encontró un producto con el id ingresado.')
        }

        return mostrarProducto(res, producto)
    } catch (error) {
        return next(error)
    }
}
