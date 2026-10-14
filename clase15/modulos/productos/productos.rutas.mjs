import { Router } from "express"
import * as controlador from './productos.controlador.mjs'
import {URL_BASE} from '../../config.mjs'

const rutasModuloProductos =new Router()

rutasModuloProductos.get(`${URL_BASE}/productos`,controlador.obtenerProductos)

export default rutasModuloProductos