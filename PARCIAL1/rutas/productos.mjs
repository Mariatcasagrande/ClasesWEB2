// Extrae la herramienta Router de Express para definir y agrupar rutas en un archivo separado.
import { Router } from 'express';
// Módulo nativo de Node.js para trabajar con el sistema de archivos (leer/escribir) usando Promesas (async/await).
import fsp from 'node:fs/promises';
// Módulo nativo de Node.js para manejar y construir rutas de archivos compatibles con cualquier sistema operativo (Windows, Mac, Linux).
import path from 'node:path';
// Importa la función middleware para guardar el archivo de balance en el servidor.
import { guardarReporte } from '../middleware/reporteMiddleware.mjs';

const router = Router();
// Apunta a la carpeta 'datos', archivo 'productos.json' que contiene la información de los productos de la panadería.
const rutaArchivo = path.join('datos', 'productos.json');

//------PUNTO 1: Endpoints REST---------

// Endpoint REST para listar todos los productos 
router.get('/productos', async (req, res) => {
  try {
    //Lee el archivo JSON del disco como texto plano de forma asíncrona en cada petición
    const texto = await fsp.readFile(rutaArchivo, 'utf-8');

    //Convierte el texto leído a un arreglo de objetos JavaScript
    const productos = JSON.parse(texto);

    //Envía la lista de productos al cliente con código HTTP 200 (OK)
    res.status(200).json(productos);
  } catch (error) {
    //Si falla la lectura o el archivo no existe, captura el error y responde con código 500 (Error interno del servidor)
    res.status(500).json({ mensaje: 'Error al leer el archivo en el servidor' });
  }
});

// Endpoint REST para consultar un ítem por parámetro de ruta
// ':id' es una variable dinámica en la URL (ej: /productos/2 o /productos/5)
router.get('/productos/:id', async (req, res) => {
  try {
    const texto = await fsp.readFile(rutaArchivo, 'utf-8');

    const productos = JSON.parse(texto);

    // Extrae el parámetro :id de la URL y lo convierte de texto a número entero
    const idBuscado = parseInt(req.params.id);

    //find busca en el arreglo el primer producto cuyo 'id' coincida exactamente con el buscado, con funcion flecha
    const producto = productos.find((p) => p.id === idBuscado);

    //Validación REST: si no se encontró coincidencia, corta y responde con código 404 
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
});

// --- PUNTO 2 y 3: Endpoint de Procedimiento + Middleware propio ---
// 'guardarReporte' actúa primero como middleware: calcula el balance, genera y guarda 'reporte.json', y llama a next().
// La función callback final (async (req, res)) solo se ejecuta si el middleware terminó con éxito.
router.get('/procedimiento/balance', guardarReporte, async (req, res) => {
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
});

export default router;