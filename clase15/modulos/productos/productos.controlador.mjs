import * as modelo from './productos.modelo.mjs' 

export function obtenerProductos(req,res){
    const productos = modelo.obtenerProductos()
    res.json(productos)
}