import express from 'express';

// Importa el middleware que procesa los datos y crea el archivo 'reporte.json'
import { guardarReporte } from './middleware/reporteMiddleware.mjs';

// Importa las funciones controladoras desde el módulo productos
import { 
  obtenerProductos, 
  obtenerProductoPorId, 
  obtenerBalance 
} from './rutas/productos.mjs';

const PUERTO = 3000;

// Inicializa la aplicación principal de Express
const app = express();

// Middleware de Express para interpretar las peticiónes en formato JSON
app.use(express.json());

// --- PUNTO 1: Endpoints REST ---

app.get('/productos', obtenerProductos);

app.get('/productos/:id', obtenerProductoPorId);

// --- PUNTOS 2 y 3: Endpoint de Procedimiento + Middleware ---

app.get('/procedimiento/balance', guardarReporte, obtenerBalance);

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});