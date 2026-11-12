// Respuesta JSON uniforme para los errores de la API.
// El front revisa 'exito' y muestra 'error' cuando algo falla.
export function mostrarError(res, estado, mensaje) {
    return res.status(estado).json({ exito: false, error: mensaje })
}
