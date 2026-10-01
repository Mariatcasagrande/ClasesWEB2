import fsp from 'node:fs/promises';
import path from 'node:path';

export const guardarReporte = async (req, res, next) => {
  try {
    const rutaProductos = path.join('datos', 'productos.json');
    const rutaReporte = path.join('reporte.json');

    // Lee los productos actuales
    const texto = await fsp.readFile(rutaProductos, 'utf-8');
    const productos = JSON.parse(texto);

    //Procesa los datos con .map() transforma cada producto creando un nuevo objeto
    const detalle = productos.map(p => ({
      nombre: p.nombre,
      categoria: p.categoria,
      stock: p.stock,
      subtotal: p.precio * p.stock
    }));

    let totalDinero = 0;

    //Recorre cada elemento del detalle sumando todos los subtotales calculados
    for (const item of detalle) {
      totalDinero += item.subtotal;
    }

    //Construye el objeto final
    const reporte = {
      proceso: 'Reporte generado automáticamente por Middleware',
      fecha: new Date().toISOString(),
      totalProductos: productos.length,
      valorTotal: totalDinero,
      detalle: detalle
    };

    // Guarda el archivo físico en el servidor:
    //    JSON.stringify convierte el objeto a texto con formato legible/indentado,
    //    y fsp.writeFile escribe o sobreescribe 'reporte.json' de manera asíncrona
    await fsp.writeFile(rutaReporte, JSON.stringify(reporte, null, 2), 'utf-8');

    next();
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el middleware al guardar reporte' });
  }
};