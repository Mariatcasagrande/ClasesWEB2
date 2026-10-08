import express from 'express'
import rutasModuloProductos from './modulos/productos/productos.rutas.mjs'

const PUERTO = 3000

const app = express()

app.use(rutasModuloProductos);

app.listen(PUERTO)