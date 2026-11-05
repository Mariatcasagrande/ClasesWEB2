import { Pool } from 'pg';
// Un 'Pool' administra múltiples conexiones a la base de datos PostgreSQL para mejorar el rendimiento.

import dotenv from 'dotenv';
// Importamos 'dotenv' para poder manejar variables de entorno (datos sensibles que no deben ir en el código fuente).

// Ejecutamos config() para leer el archivo '.env' de tu proyecto
// y cargar esas variables en el objeto global 'process.env'.
dotenv.config();

// Creamos una nueva instancia de 'Pool' pasándole un objeto de configuración.
// Los valores se toman de las variables de entorno que acabamos de cargar.
const pool = new Pool({
    host: process.env.BD_HOST || 'localhost',
    user: process.env.BD_USER,
    password: process.env.BD_PASS,
    database: process.env.BD_BD,
    port: Number(process.env.BD_PORT || 5432),
});

// Exportamos esta configuración por defecto.
// Así puedes importar 'pool' en otros archivos para ejecutar consultas (ej. pool.query('SELECT * FROM tabla')).
export default pool;