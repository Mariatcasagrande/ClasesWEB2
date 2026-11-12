// ===========================================================================
// Rutas del módulo productos.
//
// Se monta en index.mjs bajo /api/v1/productos, por lo que:
//   GET /            -> /api/v1/productos
//   GET /:id         -> /api/v1/productos/:id
//
// Son endpoints de consulta que respetan REST: recurso en plural, método GET
// y el identificador como parte de la URL.
// ===========================================================================

import { Router } from 'express'
import { obtenerProductos, obtenerProductoPorId } from './productos.controlador.mjs'

const router = Router()

router.get('/', obtenerProductos)
router.get('/:id', obtenerProductoPorId)

export default router
