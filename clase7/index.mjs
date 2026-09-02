import http from 'node:http'
console.log('inicio')
//instanciamos el servidor
const servidor = http.createServer((peticion,respuesta)=>{
    //console.log('entra peticion')
    console.log(peticion.url,peticion.method)
    
    if(peticion.url === '/'){
        return respuesta.end('principal')
    }
    if (peticion.url === '/saludo'){
      return respuesta.end('HOLAAAAAAAA')
    }
     if (peticion.url === '/saludo' && peticion.method === 'POST'){
      return respuesta.end('HOLAAAAAAAA en POST')
    }
    respuesta.statusCode=404
    respuesta.end('no existe')
    
})
//abrimos el puerto
servidor.listen(3000,()=>{
    console.log('arranco el servidor')
})