import express from 'express'
import path from 'node:path'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import loginRouter from './modulos/login/login.rutas.mjs'
import productosRouter from './modulos/productos/productos.rutas.mjs'
import procedimientosRouter from './modulos/procedimientos/procedimientos.rutas.mjs'
import { protegerApi, protegerPaginas } from './seguridad/verificar-sesion.mjs'

dotenv.config()

const PUERTO = process.env.PUERTO || 3000

const app = express()

// cookieParser lee la cookie y express.urlencoded lee los datos del formulario.
app.use(cookieParser(process.env.CLAVE_COOKIE))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// El CSS es público porque también lo usa el login.
app.get('/estilos.css', (req, res) => {
    res.sendFile(path.resolve('./paginas/front/estilos.css'))
})

// El login es la única página pública.
app.use('/login', express.static(path.resolve('./paginas/front/login')))
app.use(loginRouter)

// Páginas privadas: protegerPaginas redirige al login si no hay sesión.
app.get('/', (req, res) => res.redirect('/app/items/items.html'))
app.use('/app', protegerPaginas, express.static(path.resolve('./paginas/front')))

// Endpoints privados: protegerApi responde 401 si no hay sesión.
app.use('/api/v1/productos', protegerApi, productosRouter)
app.use('/api/v1/procedimiento', protegerApi, procedimientosRouter)

// Recibe los errores que los controladores pasan con next(error).
app.use((error, req, res, next) => {
    console.error(error.stack)
    res.status(500).json({ error: error.message })
})

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`)
})
