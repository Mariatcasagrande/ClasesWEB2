
 export const corroborar = (req,res,next)=>{
        const clave = req.body.clave
    if(CLAVE === res.body.clave){
        next()
        
    }
     res.status(403).json({mensaje:"clave incorrecta"})
}
