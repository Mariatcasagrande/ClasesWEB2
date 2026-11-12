// ===========================================================================
// Rutas del módulo procedimientos.
//
// Se monta en index.mjs bajo /api/v1/procedimiento, por lo que la URL final
// es GET /api/v1/procedimiento/balance.
//
// La ruta encadena dos middlewares: primero se ejecuta el procedimiento y
// después se devuelve el resultado.
// ===========================================================================

import { Router } from 'express'
import { ejecutarProcedimiento, devolverResultado } from './procedimientos.controlador.mjs'

const router = Router()

router.get('/balance', ejecutarProcedimiento, devolverResultado)

export default router
