// ===========================================================================
// Rutas del módulo login.
//
// El router agrupa las URLs del módulo y las conecta con su controlador.
// En index.mjs se monta con app.use(loginRouter), por lo que las rutas
// quedan disponibles en la raíz del servidor.
// ===========================================================================

import { Router } from 'express'
import { autenticar, cerrarSesion } from './login.controlador.mjs'

const router = Router()

// POST porque el formulario envía datos sensibles en el cuerpo, no en la URL.
router.post('/autenticacion', autenticar)

// GET porque el enlace del menú solo navega a una URL.
router.get('/cerrar-sesion', cerrarSesion)

export default router
