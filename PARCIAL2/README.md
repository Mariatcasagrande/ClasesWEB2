# Parcial 2 - Aplicaciones Web 2

Aplicación Express con login mediante JWT en cookie firmada, páginas protegidas y
PostgreSQL.

## Puesta en marcha

1. Copiar `.env.example` a `.env` y configurar sus valores.
2. Iniciar Docker y ejecutar `docker compose up -d`.
3. Ejecutar `pnpm install` y luego `pnpm run dev` (Node.js 20.11 o superior).
4. Abrir <http://localhost:3000/login>.

Los scripts del navegador están en archivos `.mjs` separados junto a sus páginas
HTML.

Credenciales iniciales: `admin` / `admin123`.

El SQL de `sql/base_datos.sql` crea las tablas, el usuario inicial y la función
`generar_reporte_balance()`. Docker ejecuta ese script al crear el volumen por
primera vez.

## Rutas principales

| Ruta | Acceso | Función |
| --- | --- | --- |
| `/login` | Público | Inicio de sesión |
| `/app/items/items.html` | Sesión requerida | Listado de productos |
| `/app/item/item.html?id=1` | Sesión requerida | Detalle de un producto |
| `/app/procedimiento/procedimiento.html` | Sesión requerida | Ejecuta el balance |
| `GET /api/v1/productos` | Sesión requerida | Lista los productos |
| `GET /api/v1/productos/:id` | Sesión requerida | Consulta un producto |
| `GET /api/v1/procedimiento/balance` | Sesión requerida | Guarda y devuelve un reporte |
| `/cerrar-sesion` | Público | Elimina la cookie de sesión |

Cada vista carga su módulo de navegador, por ejemplo
`/app/items/items.mjs` para el listado y `/login/login.mjs` para el login.

Las páginas privadas redirigen al login; la API devuelve errores JSON con el
código HTTP correspondiente. La cookie usa `secure` en producción, por lo que
el despliegue de producción debe usar HTTPS.

## Pruebas HTTP

Con el servidor y la base activos, ejecutar las solicitudes de `test.http` en
orden. Incluye casos sin sesión, login correcto e incorrecto, identificadores
inválidos, ejecución del procedimiento y cierre de sesión.
