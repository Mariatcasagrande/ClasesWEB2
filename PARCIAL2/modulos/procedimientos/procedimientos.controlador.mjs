import { ejecutarBalance } from './procedimientos.modelo.mjs'
import { mostrarResultado } from './procedimientos.vista.mjs'

// GET /api/v1/procedimiento/balance
export function obtenerBalance(req, res, next) {
    ejecutarBalance((error, resultado) => {
        if (error) return next(error)
        return mostrarResultado(res, resultado)
    })
}
