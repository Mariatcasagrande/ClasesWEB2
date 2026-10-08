function obtenerProductos(datos){
    datos.map((dato)=>{
        return {
            
                "id": dato.id,
                "franquicia": dato.franquicia,
                "valor": dato.valor,
                "color": dato.color
        }
    })
}