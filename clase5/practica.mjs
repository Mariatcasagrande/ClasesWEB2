// const numeros = [1,2,3,4,5]// arreglos

// //metodos para recorrer areglos

// //map(me devuelve a mi un nuevo arreglo)-- collbacks declarando la funcion no llamando
// const map_nuevo_arreglo = numeros.map((numero) => {
//         console.log(numero)
//         return numero
// })
//  console.log(map_nuevo_arreglo)
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
const productosConInteres = productos.map((producto) => {
    const preoductoCambiado ={
        nombre: producto.nombre,
        precio: producto.precio * 1.1
    }
    return preoductoCambiado
})

console.log(productosConInteres)