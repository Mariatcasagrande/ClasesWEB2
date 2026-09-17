import express from 'express'

const PUERTO = 3000

const app = express()
app.listen(PUERTO)

//middlewere static
app.use(express.json()/*parceamos los datos en formato json*/)
app.use(express.urlencoded({extended: true}))//via formulario enctype
app.use(express.static('./web'))
app.use('saludo',midd1)//statico 

app.get('/',(req,res)=>{
    console.log('estamos en raiz')
    res.end()
})
app.get('/saludo',(req,res)=>{
    console.log('estamos en saludo')
    res.end()
})
//recibir datos del cliente
app.post('/',(req,res)=>{
    console.log(req.body)
    res.end()
})