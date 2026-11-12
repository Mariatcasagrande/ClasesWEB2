// dotenv/config se importa primero para que las variables de .env estén
// disponibles antes de que se evalúen los módulos que crean el pool.
import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import cookieParser from 'cookie-parser'
import loginRouter from './modulos/login/login.rutas.mjs'
import productosRouter from './modulos/productos/productos.rutas.mjs'
import procedimientosRouter from './modulos/procedimientos/procedimientos.rutas.mjs'
import { protegerApi, protegerPaginas } from './seguridad/verificar-sesion.mjs'

const PUERTO = process.env.PUERTO || 3000
const RUTA_FRONT = path.join(import.meta.dirname, 'paginas', 'front')

const app = express()

// cookieParser lee la cookie firmada y express.urlencoded lee los datos del formulario.
app.use(cookieParser(process.env.CLAVE_COOKIE))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// El CSS es público porque también lo usa el login.
app.get('/estilos.css', (req, res) => {
    res.sendFile(path.join(RUTA_FRONT, 'estilos.css'))
})

// El login es la única página pública.
app.use('/login', express.static(path.join(RUTA_FRONT, 'login')))
app.use(loginRouter)

// Páginas privadas: protegerPaginas redirige al login si no hay sesión.
app.get('/', (req, res) => res.redirect('/app/items/items.html'))
app.use('/app', protegerPaginas, express.static(RUTA_FRONT))

// Endpoints privados: protegerApi responde 401 si no hay sesión.
app.use('/api/v1/productos', protegerApi, productosRouter)
app.use('/api/v1/procedimiento', protegerApi, procedimientosRouter)

// Las rutas API desconocidas mantienen el mismo formato JSON que el resto.
app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(404).json({
            exito: false,
            error: 'La ruta solicitada no existe.',
        })
    }

    return next()
})

/* Manejador de errores: recibe lo que los controladores pasan con next(error).
   Las rutas /api responden JSON con { exito: false, error } para que el front
   pueda mostrar el fallo. Las páginas reciben un texto genérico.
 */
app.use((error, req, res, next) => {
    console.error(error.stack)

    if (req.originalUrl.startsWith('/api')) {
        return res.status(500).json({
            exito: false,
            error: 'No se pudo completar la operación.',
        })
    }

    return res.status(500).send('Error interno del servidor.')
})

// Cualquier página o recurso desconocido recibe un 404 en lugar de una respuesta vacía.
app.use((req, res) => {
    return res.status(404).send('Página no encontrada.')
})

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`)
})
