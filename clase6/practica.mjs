//callback 
function x(cb){
    const n = 1
    cb(n)
}
x((n)=> (
    console.log('se ejecuto el cb co el numero pasado por x: ' + n)
))

const productos=[
    {
        nombre: 'pantalon' ,
        precio: 25000
    },
    {
        nombre: 'remera' ,
        precio: 5000
    }
]
//filter -- filtrar por parametros- devuelve el primer elemento encontrado

 const productoFiltrado = productos.filter((producto) => {
     
    return Number(producto.precio) >= 5000 })

 console.log(productoFiltrado)

 // find --devuelve el primer elemento encontrado
 