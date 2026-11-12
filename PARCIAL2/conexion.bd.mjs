// ===========================================================================
// Conexión a PostgreSQL.
//
// Se usa un Pool (grupo de conexiones reutilizables) en lugar de abrir y
// cerrar una conexión por cada consulta. El Pool se crea una sola vez y se
// exporta para que todos los modelos lo compartan.
// ===========================================================================

import { Pool } from 'pg'
import dotenv from 'dotenv'

// Carga las variables del .env antes de armar la configuración.
dotenv.config()

const pool = new Pool({
    host: process.env.BD_HOST,
    user: process.env.BD_USER,
    password: process.env.BD_PASS,
    database: process.env.BD_BD,
    port: process.env.BD_PORT,
})

// Exportación por defecto: los modelos hacen `import pool from '../../conexion.bd.mjs'`.
export default pool
