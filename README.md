# Sistema de Gestión de Inventario Empresarial

Aplicación web académica para administrar productos, categorías y proveedores desde una interfaz centralizada. El sistema permite registrar existencias, consultar información relacionada, actualizar datos y controlar eliminaciones que podrían afectar la integridad del inventario.

## Problema que resuelve

La gestión manual mediante cuadernos, hojas de cálculo aisladas o archivos sin una estructura común dificulta conocer las existencias reales, localizar proveedores y mantener una clasificación consistente de los productos. Esto puede provocar duplicados, información desactualizada y errores al relacionar productos con sus categorías o proveedores.

El sistema centraliza estos datos en una base MySQL y aplica reglas de integridad para que cada producto tenga una categoría y un proveedor válidos.

## Objetivo general

Desarrollar una aplicación web full stack que facilite la administración de un inventario empresarial mediante operaciones CRUD, validaciones de negocio, relaciones entre entidades y una interfaz responsive conectada a una API REST.

## Tecnologías

### Frontend

- React 19
- Vite 8
- React Router DOM
- Axios
- JavaScript, JSX y CSS

### Backend

- Node.js
- Express 5
- Sequelize 6 y Sequelize CLI
- MySQL2
- dotenv
- CORS

### Base de datos

- MySQL
- Base predeterminada: `inventario_empresarial`

## Arquitectura

El proyecto se divide en tres capas:

1. **Frontend:** aplicación React que presenta el Dashboard y los módulos CRUD. Consume la API mediante una instancia central de Axios.
2. **Backend:** API REST Express organizada en rutas, controladores, middlewares y modelos Sequelize.
3. **Base de datos:** MySQL almacena las tablas `categorias`, `proveedores`, `productos` y `SequelizeMeta`.

```text
React (5173) ──HTTP/JSON──> Express (3004) ──Sequelize──> MySQL (3306)
```

## Estructura del proyecto

```text
inventario-empresarial/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── .sequelizerc
│   ├── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docs/
│   ├── evidencias/
│   ├── diagrama-er.drawio
│   └── justificacion.md
├── .gitignore
├── PROYECTO.md
└── README.md
```

## Requisitos de instalación

En una computadora nueva se necesita:

- Node.js 20.19 o posterior, o Node.js 22.12 o posterior (requisito de Vite 8).
- npm, incluido con Node.js.
- MySQL Server 8 o compatible.
- Un usuario MySQL con permisos para crear una base de datos y tablas.
- Git, opcional para clonar el repositorio.

Compruebe las instalaciones:

```bash
node --version
npm --version
mysql --version
```

## Instalación

Desde la raíz del proyecto, instale las dependencias de cada aplicación:

```bash
cd backend
npm ci
cd ../frontend
npm ci
```

`npm ci` utiliza los archivos `package-lock.json` para obtener una instalación reproducible. Si se trabaja sin lockfiles, puede utilizarse `npm install`. No debe copiarse `node_modules` entre computadoras.

## Configuración de variables de entorno

Los archivos `.env` contienen configuración local y no se incluyen en Git. Cree cada archivo a partir de su ejemplo.

En macOS o Linux:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

En PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

### `backend/.env`

```env
PORT=3004
NODE_ENV=development

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=inventario_empresarial
DB_USER=usuario_mysql
DB_PASSWORD=contraseña_local

DB_LOGGING=false
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Sustituya `DB_USER` y `DB_PASSWORD` por credenciales locales. No publique valores reales.

### `frontend/.env`

```env
VITE_API_URL=http://localhost:3004
```

El frontend solo contiene la URL pública de la API. Nunca debe incluir credenciales MySQL.

## Creación de la base y migraciones

1. Inicie MySQL Server.
2. Configure `backend/.env`.
3. Ejecute desde `backend/`:

```bash
cd backend
npm run sequelize -- db:create
npm run sequelize -- db:migrate
```

Para consultar el estado sin modificar el esquema:

```bash
npm run sequelize -- db:migrate:status
```

Las migraciones se aplican en este orden:

1. `create-categorias`
2. `create-proveedores`
3. `create-productos`

No es necesario utilizar `sequelize.sync()`. El esquema se administra mediante migraciones.

## Ejecución

Abra dos terminales.

### Terminal 1: backend

```bash
cd backend
npm start
```

API: `http://localhost:3004`

Comprobación de salud:

```text
GET http://localhost:3004/api/health
```

### Terminal 2: frontend

```bash
cd frontend
npm run dev
```

Interfaz: `http://localhost:5173`

## Páginas de React

| Ruta | Página | Función |
|---|---|---|
| `/` | Dashboard | Muestra totales reales de productos, categorías, proveedores y unidades disponibles. |
| `/productos` | Productos | Administra código, precio, cantidad, categoría y proveedor. |
| `/categorias` | Categorías | Administra la clasificación de los productos. |
| `/proveedores` | Proveedores | Administra nombres y datos de contacto. |

## API REST

Todas las respuestas se entregan en JSON.

### Categorías

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/categorias` | Lista todas las categorías. |
| `GET` | `/api/categorias/:id` | Consulta una categoría por ID. |
| `POST` | `/api/categorias` | Crea una categoría. |
| `PUT` | `/api/categorias/:id` | Actualiza una categoría. |
| `DELETE` | `/api/categorias/:id` | Elimina una categoría sin productos asociados. |

### Proveedores

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/proveedores` | Lista todos los proveedores. |
| `GET` | `/api/proveedores/:id` | Consulta un proveedor por ID. |
| `POST` | `/api/proveedores` | Crea un proveedor. |
| `PUT` | `/api/proveedores/:id` | Actualiza un proveedor. |
| `DELETE` | `/api/proveedores/:id` | Elimina un proveedor sin productos asociados. |

### Productos

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/productos` | Lista productos e incluye su categoría y proveedor. |
| `GET` | `/api/productos/:id` | Consulta un producto con sus relaciones. |
| `POST` | `/api/productos` | Crea un producto. |
| `PUT` | `/api/productos/:id` | Actualiza un producto. |
| `DELETE` | `/api/productos/:id` | Elimina un producto. |

Endpoint adicional:

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/health` | Confirma que la API está activa. |

## Validaciones principales

- Los IDs deben ser enteros positivos.
- Se rechazan campos que no pertenecen al modelo.
- Los campos obligatorios no pueden estar vacíos.
- El nombre de categoría debe ser único.
- El código de producto debe ser único.
- El correo del proveedor debe tener un formato válido cuando se proporciona.
- Precio y cantidad no pueden ser negativos.
- La cantidad debe ser entera.
- Categoría y proveedor deben existir antes de registrar un producto.
- No se pueden eliminar categorías o proveedores con productos asociados.
- Las claves foráneas utilizan `ON UPDATE CASCADE` y `ON DELETE RESTRICT`.

Los códigos HTTP utilizados son `200`, `201`, `400`, `404`, `409` y `500`.

## Pruebas realizadas

- Conexión de Sequelize con MySQL.
- Aplicación y verificación de las tres migraciones.
- Prueba de los 15 endpoints CRUD mediante registros ficticios temporales.
- Verificación de conflictos al eliminar categorías y proveedores relacionados.
- Confirmación de persistencia de actualizaciones en MySQL.
- Limpieza completa de los registros de prueba.
- Comprobación de CORS entre Vite y Express.
- Carga de los listados reales desde React.
- Compilación de producción con `npm run build`.
- Revisión estática con `npm run lint`.

## Limitaciones conocidas

- No incluye autenticación, usuarios, roles ni permisos.
- No administra ventas, compras, movimientos históricos o alertas automáticas.
- Los listados no incluyen búsqueda, filtros ni paginación.
- Las pruebas funcionales realizadas son manuales; no existe una suite automatizada.
- El endpoint de salud confirma la disponibilidad de Express, pero no ejecuta una comprobación activa de MySQL.
- Está planteado como un proyecto académico local, no como una aplicación preparada para producción pública.

## Documentación adicional

- [Estado técnico del proyecto](PROYECTO.md)
- [Justificación académica](docs/justificacion.md)
- [Diagrama entidad-relación](docs/diagrama-er.drawio)
- [Guía de evidencias](docs/evidencias/README.md)
- [Entregables completos del Día 1](docs/evidencias/Entregables_Dia_1_Inventario_Empresarial_COMPLETO.docx)
