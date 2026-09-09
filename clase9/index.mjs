import express from 'express'

const PUERTO = 3000
const app = express()
app.get(`/`,(req,res)=>{
    const usuarios =[
        {
            nombre: 'trini',
            edad:'25',
            id:'1'
        },
        {
            nombre:'ro',
            edad: '30',
            id:'2'
        }
    ]
    res.json(usuarios)
})

////////////////////////falta el post???????????
///rutas con parametros
app.get(`/:id`,(req,res)=>{

    const id = Number(req.params.id)
    /////////////
    const usuarios =[
        {
            nombre: 'trini',
            edad:'25',
            id:1
        },
        {
            nombre:'ro',
            edad: '30',
            id:2
        }
    ]
    ////////////////
    //filtramos a partir del id
    //condicion el id del parametro debe ser igual al objeto 
     const usuarioFiltrado = usuarios.filter(((usuario) => {
        return usuario.id === id
     }))
     if(usuarioFiltrado.length > 0){
        res.json(usuarioFiltrado)
     }else{
        res.status(404).json({mensaje:' no existe usuario con ese id'})
     }
     

})

app.listen(PUERTO,()=>{
    console.log(`SERVIDOR CORRIENDO http:localhost${PUERTO}`)
})