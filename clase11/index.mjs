 import express from 'express'

 const PUERTO = 3000

 const app = express()
 app.use(express.json())
 app.listen(PUERTO)

 const datos=[
        {
            cumpu: '181',
            estado:true,

        }]

app.get('/estado',(req,res)=>{
    console.log()
    res.json(datos)
 })
 
app.post('/estado',(req,res)=>{
    datos.push(req.body)
    res.json(datos)
 })
