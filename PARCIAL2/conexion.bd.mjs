import { Pool } from 'pg'

// Configuración de la conexión a PostgreSQL. Los datos salen de .env.
// dotenv se carga una sola vez al inicio de index.mjs.
const pool = new Pool({
    host: process.env.BD_HOST,
    user: process.env.BD_USER,
    password: process.env.BD_PASS,
    database: process.env.BD_BD,
    port: process.env.BD_PORT,
})

export default pool
