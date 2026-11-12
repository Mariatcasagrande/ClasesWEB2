export function mostrarProductos(res, productos) {
    return res.json(productos)
}

export function mostrarProducto(res, producto) {
    return res.json(producto)
}

export function mostrarError(res, estado, mensaje) {
    return res.status(estado).json({ error: mensaje })
}
