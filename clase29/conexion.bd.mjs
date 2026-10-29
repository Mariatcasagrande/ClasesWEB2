import {Pool} from 'pg'
import detenv from 'dotenv'
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.BD_PASS,
    database: process.env.BD_BD
    
})