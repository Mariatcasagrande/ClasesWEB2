async function obtenerDatos() {
  // Busca y guarda en una constante el elemento HTML que tiene el id "contenedor"
const contenedor = document.getElementById('contenedor');

try {
  // Hace una petición asíncrona para obtener el archivo JSON
  const respuesta = await fetch('recursos/datos/productos.json');

    // Comprobamos si la respuesta del servidor es correcta
    if (respuesta.ok) {
      const productos = await respuesta.json();

      // Limpiamos la plantilla estática que viene en el HTML
      contenedor.innerHTML = '';

      //Recorremos y sumamos cada tarjeta al contenedor 
      productos.forEach(producto => {
        contenedor.innerHTML += `
          <article class="producto">
            <h3 class="nombre">${producto.nombre}</h3>
            <p class="precio" value="${producto.precio}">Precio: $${producto.precio}</p>
            <p class="stock" value="${producto.stock}">Stock: ${producto.stock}</p>
          </article>
        `;
      });

      //Sumamos el mensaje de éxito
      contenedor.innerHTML += '<p class="mensajeExito">¡Productos cargados con éxito!</p>';

    } else {
      // Mensaje de error si la respuesta no fue satisfactoria
      contenedor.innerHTML = '<p class="mensaje error">Ocurrió un error al cargar los productos.</p>';
    }

  } catch (error) {
    // Mensaje de error si ocurre un fallo de red o conexión
    console.log(error);
    contenedor.innerHTML = '<p class="mensaje error">Ocurrió un error de conexión.</p>';
  }
}

// Ejecutamos la función
obtenerDatos();



//ACTIVIDAD 1
//Aplicaciones Web 2
//En esta web simple, deberá implementar un script cuya acción sea cargar, vía función global fetch,
//  un JSON y lo renderice en el documento HTML.
//Desarrollar:
//El script debe ser una función llamada obtenerDatos() asíncrona. El uso de fetch debe implementarse con el async/await.
//Renderizar los datos en el documento HTML.
//Se deberá investigar y analizar el Objeto Response devuelto por fetch()
//Implementar un mensaje en la interfaz para el usuario con dos opciones:
//Opción en el caso de que la respuesta haya sido satisfactoria.
//Opción en el caso de que haya habido un error.  

