import express from 'express'

const PUERTO = 3000
const app = express()

app.get('/',(req,res)=>{

    //res.send('hola con send')
    //res.send(Buffer.from('whoop'));
    res.send({ mensaje: 'hola' });
    //res.send('<p>some html</p>');
    //res.status(404).send('Sorry, we cannot find that!');
    //res.status(500).send({ error: 'something blew up' });
})



app.listen(PUERTO,()=>{
    console.log(`SERVIDOR EXPRESS CORRIENDO,PUERTO ${PUERTO}`)
})
