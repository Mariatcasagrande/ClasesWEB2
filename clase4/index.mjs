console.log('hola')
import fsp from 'node:fs/promises';
import path from 'node:path';
const ruta = path.join('./usuario.json')
let usuario= '';
try{
    usuario = await fsp.readFile(ruta,'utf-8')
    
} catch(error){
    console.log(error.message)
}
const objetoUsuario = JSON.parse(usuario)
console.log(objetoUsuario.nombre)
//escribir un archivo
 try{
    const ruta ='./saludo.txt'
    fsp.writeFile(ruta,'hola mundo este es mi archivo',{encoding: 'utf-8',flag:'a'/*agrega el contenido*/ })
 }catch(error){
    console.log(error)
 }

