import { buscarTodos, buscarPorId } from './productos.modelo.mjs'
import { mostrarProductos, mostrarProducto, mostrarError } from './productos.vista.mjs'

// GET /api/v1/productos
export function obtenerProductos(req, res, next) {
    buscarTodos((error, productos) => {
        if (error) return next(error)
        return mostrarProductos(res, productos)
    })
}

// GET /api/v1/productos/:id
export function obtenerProductoPorId(req, res, next) {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
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
