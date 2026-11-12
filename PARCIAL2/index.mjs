// ===========================================================================
// Punto de entrada del backend (Parcial 2 - Aplicaciones Web 2).
//
// Flujo general de una petición:
//   navegador -> Express -> middleware de seguridad -> router del módulo
//   -> controlador -> modelo -> PostgreSQL
//   -> vista -> respuesta (HTML, JSON o redirect)
//
// Las páginas y la API se sirven desde este mismo servidor, por lo que
// comparten dominio y puerto, tal como pide la consigna.
// ===========================================================================

import express from 'express'
import path from 'node:path'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import loginRouter from './modulos/login/login.rutas.mjs'
import productosRouter from './modulos/productos/productos.rutas.mjs'
import procedimientosRouter from './modulos/procedimientos/procedimientos.rutas.mjs'
import { protegerApi, protegerPaginas } from './seguridad/verificar-sesion.mjs'

// Carga las variables del archivo .env en process.env.
// Tiene que ejecutarse antes de leer PUERTO o cualquier otra configuración.
dotenv.config()

const PUERTO = process.env.PUERTO || 3000

const app = express()

// cookieParser interpreta la cookie de la petición.
// Se le pasa un secreto (igual que en la clase 21) para que la cookie viaje
// firmada. Así, si alguien modifica el valor de la cookie en el navegador,
// cookie-parser la descarta y req.signedCookies queda vacío.
// La cookie contiene el JWT que se genera al iniciar sesión.
app.use(cookieParser(process.env.CLAVE_COOKIE || process.env.CLAVE_PRIVADA))

// express.urlencoded permite leer los datos que llegan desde un <form> HTML.
// express.json permite leer cuerpos JSON enviados por un cliente de la API.
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Hoja de estilos compartida. Es pública porque también la usa el login.
app.get('/estilos.css', (req, res) => {
    res.sendFile(path.resolve('./paginas/front/estilos.css'))
})

// El login es público: es lo único que se puede abrir sin haber iniciado sesión.
// express.static sirve paginas/login/index.html cuando se visita /login.
app.use('/login', express.static(path.resolve('./paginas/login')))
app.use(loginRouter)

// Páginas privadas. protegerPaginas corta el acceso si no hay una cookie
// con un JWT válido; en ese caso redirige al login.
app.get('/', (req, res) => res.redirect('/app/items/items.html'))
app.use('/app', protegerPaginas, express.static(path.resolve('./paginas/front')))

// Endpoints privados de cada módulo.
// protegerApi responde 401 si falta la cookie o el JWT no es válido.
app.use('/api/v1/productos', protegerApi, productosRouter)
app.use('/api/v1/procedimiento', protegerApi, procedimientosRouter)

// Manejador central de errores.
// Recibe todo lo que los controladores pasan con next(error).
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: err.message })
})

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`)
})
