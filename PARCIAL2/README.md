# Parcial 2 - Aplicaciones Web 2

Aplicación Express con módulos (modelo, vista y controlador), login con JWT en
cookie y base de datos PostgreSQL en Docker.

## Ejecutar

1. Copiar `.env.example` a `.env` (si todavía no existe).
2. Abrir Docker Desktop.
3. Levantar la base:

   ```bash
   docker compose up -d
   ```

   La primera vez se ejecuta `sql/base_datos.sql` y se crean las tablas.

4. Iniciar el servidor:

   ```bash
   npm run dev
   ```

   También se puede usar `npm start`.

5. Abrir <http://localhost:3000/login>.

Credenciales: usuario `admin`, contraseña `admin123`.

## Estructura

```
PARCIAL2/
├── index.mjs
├── conexion.bd.mjs
├── seguridad/
│   └── verificar-sesion.mjs
├── modulos/
│   ├── login/
│   │   ├── login.modelo.mjs
│   │   ├── login.controlador.mjs
│   │   ├── login.vista.mjs
│   │   └── login.rutas.mjs
│   ├── productos/
│   │   ├── productos.modelo.mjs
│   │   ├── productos.controlador.mjs
│   │   ├── productos.vista.mjs
│   │   └── productos.rutas.mjs
│   └── procedimientos/
│       ├── procedimientos.modelo.mjs
│       ├── procedimientos.controlador.mjs
│       ├── procedimientos.vista.mjs
│       └── procedimientos.rutas.mjs
├── paginas/front/
│   ├── login/index.html
│   ├── items/items.html
│   ├── item/item.html
│   ├── procedimiento/procedimiento.html
│   └── estilos.css
├── sql/base_datos.sql
├── docker-compose.yml
├── test.http
├── .env
├── .env.example
└── package.json
```

Cada módulo tiene:

- **modelo**: consulta la base.
- **controlador**: recibe la petición y llama al modelo.
- **vista**: arma la respuesta.
- **rutas**: define las URLs del módulo.

## Páginas

| Ruta | Descripción |
| --- | --- |
| `/login` | Inicio de sesión |
| `/app/items/items.html` | Listado de productos |
| `/app/item/item.html?id=1` | Detalle de un producto |
| `/app/procedimiento/procedimiento.html` | Ejecuta el procedimiento |
| `/cerrar-sesion` | Borra la cookie y vuelve al login |

Las páginas de `/app` están protegidas: sin sesión redirigen al login.

## API

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/autenticacion` | Inicia sesión |
| `GET` | `/api/v1/productos` | Lista los productos |
| `GET` | `/api/v1/productos/:id` | Devuelve un producto |
| `GET` | `/api/v1/procedimiento/balance` | Ejecuta el procedimiento |

Sin sesión, la API responde `401`.

## Login y seguridad

1. `POST /autenticacion` busca el usuario y compara la contraseña con `bcrypt.compare`.
2. Si es correcta, `jwt.sign` genera un token de una hora.
3. El token se guarda en una cookie `httpOnly`, `sameSite: 'lax'` y firmada.
4. Las páginas y la API verifican el token con `jwt.verify`.
5. `/cerrar-sesion` borra la cookie.

## Base de datos

El contenedor se conecta con los datos de `.env`:

| Variable | Valor |
| --- | --- |
| `BD_HOST` | `localhost` |
| `BD_PORT` | `5433` |
| `BD_USER` | `postgres` |
| `BD_PASS` | `postgres` |
| `BD_BD` | `parcial2_aw2` |

Para borrar los datos y volver a crear todo:

```bash
docker compose down -v
docker compose up -d
```
