// Módulo para interactuar con el sistema de archivos con Promesas (async/await)
import fsp from 'node:fs/promises';

// Módulo nativo para construir rutas de archivos compatibles con cualquier SO
import path from 'node:path';

const rutaArchivo = path.join('datos', 'productos.json');

// --- PUNTO 1: Endpoints REST ---

// Función 1: Obtener la lista completa de productos
export const obtenerProductos = async (req, res) => {
  try {
    // Lee el archivo de datos directamente desde el disco en texto plano
    const texto = await fsp.readFile(rutaArchivo, 'utf-8');

    // Convierte el texto JSON a un arreglo de objetos JavaScript
    const productos = JSON.parse(texto);

    // Responde al cliente con el listado completo y código HTTP 200 (OK)
    res.status(200).json(productos);
  } catch (error) {
    // Captura fallas de lectura o archivo inexistente y devuelve error 500
    res.status(500).json({ mensaje: 'Error al leer el archivo en el servidor' });
  }
};

// Función 2: Obtener un producto puntual a partir de su ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const texto = await fsp.readFile(rutaArchivo, 'utf-8');
    const productos = JSON.parse(texto);

    // Convierte el parámetro dinámico recibido en la URL (:id) de String a entero
    const idBuscado = parseInt(req.params.id);

    // Busca mediante una función flecha el primer ítem cuyo 'id' coincida 
    const producto = productos.find((p) => p.id === idBuscado);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
};

// --- PUNTO 2 y 3: Procedimiento + Respuesta final tras el Middleware ---

// Función 3: Leer y devolver el reporte generado previamente por el middleware
export const obtenerBalance = async (req, res) => {
  try {
    const rutaReporte = path.join('reporte.json');

    const textoReporte = await fsp.readFile(rutaReporte, 'utf-8');

    const reporte = JSON.parse(textoReporte);

    res.status(200).json({
      mensaje: 'Procedimiento ejecutado y guardado en reporte.json',
      resultado: reporte
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al devolver el balance' });
  }
};