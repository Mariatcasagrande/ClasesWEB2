/* uso demodulos built-in
con el sistema de modulos modernos
*/
import os from 'node:os';

console.log(os.totalmem()/1024/*kb*//1024/*mg*//1024/*gb*/)
console.log((os.totalmem()- os.freemem())/1024/*kb*//1024/*mg*//1024/*gb*/)

import fsp from 'node:fs/promises';

const contante = await fsp.readFile('./txto.txt','utf8')

console.log(contante)