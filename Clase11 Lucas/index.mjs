import express from 'express'

const Puerto = 3000

const logs = [{compu: 91, estado: "activo"}]

const app = express()

app.use(express.json());

app.listen(Puerto, () => {
    console.log(`Servidor corriendo http://localhost:${Puerto}`)
})

app.get('/estado',(req, res) => {
   res.json(logs)
})

//crear arreglo donde guardaremos como un log de estados

app.post('/estado',(req, res) => {
    logs.push(req.body)
    res.json(logs)
})





