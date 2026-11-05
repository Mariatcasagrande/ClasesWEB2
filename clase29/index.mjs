import express from 'express'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import pool from './conexion.bd.mjs'

dotenv.config()

const PUERTO = Number(process.env.PUERTO || 3000)
const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
    throw new Error('Falta configurar SESSION_SECRET en el archivo .env')
}

const app = express()

app.use(cookieParser(sessionSecret))
app.use(express.urlencoded({ extended: true }))

app.post('/autenticacion', async (req, res) => {
    const { usuario, pass } = req.body

    if (typeof usuario !== 'string' || typeof pass !== 'string' || !usuario.trim() || !pass) {
        return res.redirect('/login?usuarioincorrecto')
    }

    const resultado = await pool.query(
        'SELECT id, password_hash FROM usuarios WHERE username = $1',
        [usuario.trim()]
    )
    const usuarioEncontrado = resultado.rows[0]

    if (!usuarioEncontrado || !(await bcrypt.compare(pass, usuarioEncontrado.password_hash))) {
        return res.redirect('/login?usuarioincorrecto')
    }

    const sesionId = randomUUID()
    await pool.query('UPDATE usuarios SET session_id = $1 WHERE id = $2', [
        sesionId,
        usuarioEncontrado.id,
    ])

    res.cookie('sesionId', sesionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        signed: true,
        maxAge: 1000 * 60 * 60 * 24,
    })
    return res.redirect('/admin')
})

app.post('/registrar', async (req, res) => {
    const { usuario, pass } = req.body

    if (typeof usuario !== 'string' || typeof pass !== 'string' || !usuario.trim() || !pass) {
        return res.redirect('/login?errorregistrando')
    }

    try {
        const claveHasheada = await bcrypt.hash(pass, 10)
        await pool.query(
            'INSERT INTO usuarios(username, password_hash) VALUES ($1, $2)',
            [usuario.trim(), claveHasheada]
        )
        return res.redirect('/login?usuarioregistrado')
    } catch (error) {
        console.error('Error al registrar el usuario:', error)
        return res.redirect('/login?errorregistrando')
    }
})

async function verificarCookie(req, res, next) {
    const sesionId = req.signedCookies.sesionId

    if (!sesionId) {
        return res.redirect('/login?autorizado=false')
    }

    try {
        const resultado = await pool.query(
            'SELECT id FROM usuarios WHERE session_id = $1',
            [sesionId]
        )

        if (resultado.rows.length === 0) {
            return res.redirect('/login?autorizado=false')
        }

        return next()
    } catch (error) {
        return next(error)
    }
}

app.use('/admin', verificarCookie, express.static(path.resolve('./front')))
app.use('/login', express.static(path.resolve('./login')))

app.use((error, req, res, next) => {
    console.error('Error en la aplicación:', error)
    if (res.headersSent) {
        return next(error)
    }
    return res.status(500).send('Error interno del servidor')
})

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`)
})
