import productos from "../../datos/productos.mjs";
import productos from "../../datos/productos.mjs";

//get todos
export function obtenerProductos(){
    return productos
}

export function obtenerProducto(id){
    const producto =productos.filtrer(producto => producto.id === id)
    return producto
}
/////hacer 