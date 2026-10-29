import express from 'express'
import dotenv from 'dotenv'
import path from 'node:path'
import cookieParser from 'cookie-parser'

const tablaUsuarios = {
    nombre: 'admin',
    pass: '123456'
}

const PUERTO = 3000
const app = express()

app.listen(PUERTO)
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.post('/autenticacion' ,(req,res)=>{
    console.log(req.body)
    // Asignación desestructurante
    const {usuario, pass} = req.body // Saco los datos del usuario y contraseña que vienen del body
    if(usuario === tablaUsuarios.nombre && pass === tablaUsuarios.pass){
        // Creamos la cookie
        res.cookie('sesionId',123456,{
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 10
        })
        return res.redirect('/admin')
    }
    // El redirect viene con un status de 302
    res.redirect('/login')

})
app.post('/registrar' ,async (req,res)=>{
    console.log(req.body)
    // Asignación desestructurante
    const {usuario, pass} = req.body 
    // chequear los datos
    //insertamos en tabla--hashing de claves

    const salt = await bcrypt.genSalt(10);
    const clave_hasheada = await bcrypt.hash(pass, salt);
    console.log(clave_hasheada)

    res.redirect('/login')

})
// Estáticos
function verificarCookie(req, res, next){
    console.log(req.signedCookies)
    if(req.cookies.sesionId === '123456'){
        return next()
    }
    res.redirect('/login?autorizado=false')
}


app.use('/admin', verificarCookie, express.static(path.resolve('./front')))
app.use('/login' ,express.static(path.resolve('./login')))