import { buscarTodos, buscarPorId } from './productos.modelo.mjs'
import { mostrarProductos, mostrarProducto, mostrarError } from './productos.vista.mjs'

// GET /api/v1/productos
export async function obtenerProductos(req, res, next) {
    try {
        const productos = await buscarTodos()
        return mostrarProductos(res, productos)
    } catch (error) {
        next(error)
    }
}

// GET /api/v1/productos/:id
export async function obtenerProductoPorId(req, res, next) {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
        return mostrarError(res, 400, 'El id debe ser un número entero positivo.')
    }

    try {
        const producto = await buscarPorId(id)

        if (!producto) {
            return mostrarError(res, 404, 'No se encontró un producto con ese id.')
        }

        return mostrarProducto(res, producto)
    } catch (error) {
        next(error)
    }
}
