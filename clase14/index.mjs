import express from 'express'
import rutasApiV1 from './rutas/rutas.mjs'

const PUERTO = 3000

const app = express()
app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`)
})

app.use(rutasApiV1)