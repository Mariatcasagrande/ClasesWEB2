 //agregar middlerware chequeado clave
 import express from 'express'
 import {corroborar} from './middleware.mjs'

 const PUERTO = 3000
 const CLAVE = '123'
 const app = express()
 app.use(express.json())
 app.listen(PUERTO)


 const datos=[
    {
        compu: '181',
        estado:true,
        clave:"123"
    }]

app.get('/estado',(req,res)=>{
    console.log()
    res.json(datos)
})
 
app.post('/estado',corroborar,(req,res)=>{
    datos.push(req.body)
    return res.status(201).json({mensaje:"se guardo el dato"})
 })
