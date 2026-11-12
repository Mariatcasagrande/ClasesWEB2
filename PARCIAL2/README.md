# Parcial 2 - Aplicación Web 2

Aplicación Express organizada **por módulos**, con **modelo, vista y controlador**
dentro de cada módulo, autenticación por **JWT en cookie httpOnly** y base de
datos **PostgreSQL en Docker**.

La organización sigue el ejemplo de la cátedra (`Parcial1`): un `index.mjs` raíz,
la carpeta `modulos/`, la carpeta `seguridad/` y las páginas en `paginas/`.

## Requisitos

- Node.js
- Docker Desktop (con el motor iniciado)

## Ejecución

1. Abrí **Docker Desktop** y esperá a que el motor esté corriendo.
2. Levantá la base de datos:

   ```bash
   docker compose up -d
   ```

   La primera vez descarga la imagen de PostgreSQL y ejecuta `sql/base_datos.sql`
   automáticamente (crea tablas, productos y el usuario `admin`).

3. Iniciá el servidor:

   ```bash
   npm start
   ```

4. Abrí <http://localhost:3000/login>.

Para detener la base:

```bash
docker compose down
```

> Si usás `npm`, también están los atajos `npm run db:up`, `npm run db:down` y `npm run db:logs`.

## Credenciales

| Usuario | Contraseña |
| --- | --- |
| `admin` | `admin123` |

La contraseña se guarda hasheada con **bcryptjs** y se verifica con `bcrypt.compare`.

La tabla `usuarios` y el `INSERT` de `admin` siguen el script entregado por la
cátedra: incluye la columna `session_id` (no se usa porque la sesión va en el JWT)
y el hash bcrypt provisto para `admin123`.

## Seguridad (login, cookie y JWT)

El flujo es el mismo de la clase 21:

1. `POST /autenticacion` busca el usuario y compara la contraseña con
   `bcrypt.compare`.
2. Si es correcta, `jwt.sign` genera un token firmado con `CLAVE_PRIVADA` y con
   expiración (`JWT_EXPIRACION_SEGUNDOS`).
3. El token se guarda en una cookie `httpOnly`, `sameSite: 'lax'`, con `maxAge`
   y **firmada** con `CLAVE_COOKIE` (`signed: true`).
4. `protegerPaginas` y `protegerApi` leen `req.signedCookies` y verifican el JWT
   con `jwt.verify`. Si la cookie fue alterada o el token venció, se rechaza.
5. `/cerrar-sesion` borra la cookie y redirige al login.

Hay dos firmas independientes: la de la cookie (cookie-parser) y la del JWT
(jsonwebtoken). La cookie es `httpOnly`, por lo que JavaScript del navegador no
puede leer el token.

## Estructura

```
PARCIAL2/
├── index.mjs                    # Configura Express, monta los módulos y escucha
├── conexion.bd.mjs              # Pool de conexiones a PostgreSQL
├── seguridad/
│   └── verificar-sesion.mjs     # protegerApi y protegerPaginas (JWT)
├── modulos/
│   ├── login/
│   │   ├── login.modelo.mjs     # Consulta de usuarios
│   │   ├── login.controlador.mjs# Autenticación y cierre de sesión
│   │   ├── login.rutas.mjs      # POST /autenticacion, GET /cerrar-sesion
│   │   └── login.vista.mjs      # Respuestas: cookie, redirects y errores
│   ├── productos/
│   │   ├── productos.modelo.mjs
│   │   ├── productos.controlador.mjs
│   │   ├── productos.rutas.mjs
│   │   └── productos.vista.mjs
│   └── procedimientos/
│       ├── procedimientos.modelo.mjs
│       ├── procedimientos.controlador.mjs
│       ├── procedimientos.rutas.mjs
│       └── procedimientos.vista.mjs
├── paginas/
│   ├── login/
│   │   ├── index.html
│   │   └── login.mjs
│   └── front/
│       ├── items/
│       │   ├── items.html
│       │   └── items.mjs
│       ├── item/
│       │   ├── item.html
│       │   └── item.mjs
│       ├── procedimiento/
│       │   ├── procedimiento.html
│       │   └── procedimiento.mjs
│       ├── menu.mjs
│       ├── api.mjs
│       ├── mensajes.mjs
│       └── estilos.css
├── sql/base_datos.sql
├── docker-compose.yml
├── .env
├── .env.example
└── package.json
```

### ¿Cómo se separa cada módulo?

Cada módulo tiene las cuatro capas que usa el ejemplo del profesor:

- **modelo**: consulta la base de datos y devuelve los datos.
- **controlador**: valida la petición, llama al modelo y elige la respuesta.
- **vista**: arma la respuesta (JSON, redirect o error).
- **rutas**: define las URLs del módulo y las conecta con el controlador.

Las páginas HTML y los scripts del navegador viven en `paginas/`, igual que en
`Parcial1`. El CSS es uno solo y se sirve públicamente en `/estilos.css` porque
también lo usa el login.

## Páginas

| Ruta | Descripción |
| --- | --- |
| `/login` | Inicio de sesión |
| `/app/items/items.html` | Listado de productos |
| `/app/item/item.html?id=1` | Detalle de un producto |
| `/app/procedimiento/procedimiento.html` | Ejecuta el procedimiento de balance |
| `/cerrar-sesion` | Elimina la cookie y vuelve al login |

Las páginas de `/app` están protegidas por `protegerPaginas`: si no hay sesión,
redirigen al login. Las páginas y la API comparten el mismo dominio y puerto.

## API

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/autenticacion` | Inicia sesión y crea la cookie |
| `GET` | `/api/v1/productos` | Lista todos los productos |
| `GET` | `/api/v1/productos/:id` | Devuelve un producto |
| `GET` | `/api/v1/procedimiento/balance` | Ejecuta `generar_reporte_balance()` |

Los endpoints de la API están protegidos por `protegerApi`: sin una cookie
firmada con un JWT válido responden `401`.

## Base de datos con Docker

`docker-compose.yml` levanta un contenedor `parcial2_bd` con PostgreSQL 17 y monta
`sql/base_datos.sql` en `/docker-entrypoint-initdb.d/`, por lo que el esquema se
crea solo en el primer arranque.

| Variable | Valor |
| --- | --- |
| `BD_HOST` | `localhost` |
| `BD_PORT` | `5433` (puerto del host; dentro del contenedor es `5432`) |
| `BD_USER` | `postgres` |
| `BD_PASS` | `postgres` |
| `BD_BD` | `parcial2_aw2` |

El puerto del host se toma de `BD_PORT` en `.env`. Se usa `5433` porque el
PostgreSQL instalado en Windows ya ocupa el `5432`. Si en tu equipo el `5432`
está libre, podés cambiar `BD_PORT=5432` y reiniciar el contenedor.

Los datos quedan en el volumen `parcial2_pgdata`. Para borrarlos y volver a
ejecutar el script desde cero:

```bash
docker compose down -v
docker compose up -d
```

## Estilos

Todos los estilos están en `paginas/front/estilos.css`, con colores HEX simples
y sin dependencias externas.

Paleta: crema `#F4EFE6`, verde `#1E2A23`, terracota `#B4472A`, menú `#1C2A23`
y ocre `#D9A05B`.
