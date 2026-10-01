import express from 'express';
import productosRouter from './rutas/productos.mjs';

const PUERTO = 3000;
const app = express();

app.use(express.json());

// Usamos las rutas que importamos
app.use(productosRouter);

app.listen(PUERTO, () => {
  console.log(`Servidor de panadería escuchando en http://localhost:${PUERTO}`);
});