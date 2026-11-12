import { ejecutarBalance } from './procedimientos.modelo.mjs'
import { mostrarResultado } from './procedimientos.vista.mjs'

// GET /api/v1/procedimiento/balance
export async function obtenerBalance(req, res, next) {
    try {
        const resultado = await ejecutarBalance()
        return mostrarResultado(res, resultado)
    } catch (error) {
        next(error)
    }
}
