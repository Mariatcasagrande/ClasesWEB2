// ===========================================================================
// Controlador del módulo procedimientos.
//
// Se divide en dos middlewares encadenados por la ruta:
//   1. ejecutarProcedimiento: ejecuta la función y guarda el resultado.
//   2. devolverResultado: envía la respuesta al cliente.
//
// Separarlo así permite reutilizar el resultado (por ejemplo, para guardarlo
// en un archivo) sin mezclar la ejecución con la respuesta HTTP.
// ===========================================================================

import { ejecutarBalance } from './procedimientos.modelo.mjs'
import { mostrarResultado, mostrarError } from './procedimientos.vista.mjs'

// Middleware que ejecuta el procedimiento y guarda el resultado en la petición.
export async function ejecutarProcedimiento(req, res, next) {
    try {
        req.resultado = await ejecutarBalance()
        return next()
    } catch (error) {
        return next(error)
    }
}

// Devuelve lo que dejó el middleware anterior.
export function devolverResultado(req, res) {
    if (!req.resultado) {
        return mostrarError(res, 500, 'No hay resultados para mostrar.')
    }

    return mostrarResultado(res, req.resultado)
}
