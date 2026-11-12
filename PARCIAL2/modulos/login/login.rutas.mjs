import { Router } from 'express'
import { autenticar, cerrarSesion } from './login.controlador.mjs'

const router = Router()

router.post('/autenticacion', autenticar)
router.get('/cerrar-sesion', cerrarSesion)

export default router
