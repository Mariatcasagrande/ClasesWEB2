import { buscarTodos, buscarPorId } from './productos.modelo.mjs'
import { mostrarProductos, mostrarProducto } from './productos.vista.mjs'
import { mostrarError } from '../../seguridad/respuestas.mjs'

// GET /api/v1/productos
export function obtenerProductos(req, res, next) {
    buscarTodos((error, productos) => {
        if (error) return next(error)
        return mostrarProductos(res, productos)
    })
}

// GET /api/v1/productos/:id
export function obtenerProductoPorId(req, res, next) {
    const textoId = req.params.id

    // Solo acepto dígitos. Así descarto 'abc', '1.5' y también '1e2',
    // que con Number() se convertiría en 100 y pasaría la validación.
    if (!/^\d+$/.test(textoId)) {
        return mostrarError(res, 400, 'El id debe ser un número entero positivo.')
    }

    const id = Number(textoId)

    if (id <= 0) {
        return mostrarError(res, 400, 'El id debe ser un número entero positivo.')
    }

    buscarPorId(id, (error, producto) => {
        if (error) return next(error)

        if (!producto) {
            return mostrarError(res, 404, 'No se encontró un producto con ese id.')
        }

        return mostrarProducto(res, producto)
    })
}
