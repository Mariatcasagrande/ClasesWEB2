// ===========================================================================
// Vista del módulo procedimientos.
//
// Envuelve el resultado en un objeto con `exito` para que el front pueda
// distinguir una ejecución correcta de un error.
// ===========================================================================

// Respuesta correcta: 200 OK con el reporte generado.
export function mostrarResultado(res, resultado) {
    return res.status(200).json({ exito: true, resultado })
}

// Error controlado: el estado lo define el controlador.
export function mostrarError(res, estado, mensaje) {
    return res.status(estado).json({ error: mensaje })
}
