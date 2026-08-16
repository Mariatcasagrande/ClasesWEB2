async function obtenerDatos() {
  const respuesta = await fetch('recursos/datos/productos.json');
  const productos = await respuesta.json();

  const contenedor = document.getElementById('contenedor');
  contenedor.innerHTML = ''; // Se limpia la plantilla estática

  productos.forEach(producto => {
    contenedor.innerHTML += `
      <article class="producto">
        <h3 class="nombre">${producto.nombre}</h3>
        <data class="precio" value="${producto.precio}">Precio: $${producto.precio}</data>
        <data class="stock" value="${producto.stock}">Stock: ${producto.stock}</data>
      </article>
    `;
  });
}

obtenerDatos();

//ACTIVIDAD 1
//Aplicaciones Web 2

//Temas:
//Formato JSON
//Uso de fetch()
//Asincronicidad
//Rutas web (URL)
//Descarga proyecto
//En esta web simple, deberá implementar un script cuya acción sea cargar, vía función global fetch,
//  un JSON y lo renderice en el documento HTML.
//Desarrollar:
//El script debe ser una función llamada obtenerDatos() asíncrona. El uso de fetch debe implementarse con el async/await.
//Renderizar los datos en el documento HTML.
//Se deberá investigar y analizar el Objeto Response devuelto por fetch()
//Responder las siguientes preguntas:
//¿Qué tipo de proceso realiza fetch()?
//¿Por qué es asíncrono?
//¿Qué protocolo utiliza en este caso? http
//¿Cuál es el URL completo al recurso productos.json? ACTIVIDAD1/recursos/datos/productos.json
//Implementar un mensaje en la interfaz para el usuario con dos opciones:
//Opción en el caso de que la respuesta haya sido satisfactoria.
//Opción en el caso de que haya habido un error.  
