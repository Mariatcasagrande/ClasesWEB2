import { Router } from 'express'
import { obtenerBalance } from './procedimientos.controlador.mjs'

const router = Router()

router.get('/balance', obtenerBalance)

export default router
