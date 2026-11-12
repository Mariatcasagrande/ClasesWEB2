// ===========================================================================
// Vista del módulo productos.
//
// Centraliza las respuestas JSON y los códigos de estado HTTP. El controlador
// decide qué mostrar; la vista se encarga de cómo enviarlo.
// ===========================================================================

// Lista completa de productos: 200 OK.
export function mostrarProductos(res, productos) {
    return res.status(200).json(productos)
}

// Un producto encontrado: 200 OK.
export function mostrarProducto(res, producto) {
    return res.status(200).json(producto)
}

// Error controlado: el estado lo define el controlador (400, 404, etc.).
export function mostrarError(res, estado, mensaje) {
    return res.status(estado).json({ error: mensaje })
}
