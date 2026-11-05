# Sistema de Gestión de Inventario Empresarial

Aplicación empresarial full-stack para administrar catálogos, almacenamiento, existencias y operaciones de inventario con autenticación JWT, trazabilidad e integridad transaccional.

## Objetivo general

Centralizar el registro de productos y sus existencias por ubicación, controlar entradas, salidas y traslados, y procesar compras, ventas y ajustes sin permitir inventario negativo ni modificaciones directas que rompan el historial.

## Tecnologías

- Frontend: React 19, Vite, React Router y Axios.
- Backend: Node.js, Express 5, Sequelize 6.
- Base de datos: MySQL.
- Seguridad: JWT con expiración, bcrypt y rutas privadas.
- Herramientas: Sequelize CLI, Postman y diagrams.net.

## Arquitectura

```text
React/Vite :5173
      │ Axios + Authorization: Bearer <JWT>
      ▼
Express API :3004
      │ controladores → servicios transaccionales → modelos Sequelize
      ▼
MySQL: inventario_empresarial
```

El frontend usa páginas protegidas y un cliente Axios compartido. Express separa rutas, middleware, controladores y servicios. Sequelize administra modelos, asociaciones, transacciones y bloqueos de filas.

## Requisitos previos

- Node.js compatible con las dependencias del proyecto.
- npm.
- MySQL 8 o compatible.
- Base de datos `inventario_empresarial`.
- Puertos 3004 y 5173 disponibles.

## Instalación

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Variables de entorno

Copiar los archivos de ejemplo y completar valores locales. No versionar archivos `.env` ni publicar secretos.

Backend (`backend/.env`):

```dotenv
PORT=3004
DB_HOST=localhost
DB_PORT=3306
DB_NAME=inventario_empresarial
DB_USER=<USUARIO_LOCAL>
DB_PASSWORD=<CONTRASENA_LOCAL>
JWT_SECRET=<SECRETO_ALEATORIO_LOCAL>
JWT_EXPIRES_IN=1h
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Frontend (`frontend/.env`, opcional):

```dotenv
VITE_API_URL=http://localhost:3004
```

## MySQL y migraciones

Crear únicamente la base vacía; Sequelize crea las estructuras:

```sql
CREATE DATABASE inventario_empresarial
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Aplicar migraciones:

```bash
cd backend
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:status
```

El proyecto contiene 17 migraciones aplicadas: 15 tablas empresariales, una ampliación de usuarios y una migración idempotente de tipos técnicos de movimiento.

## Ejecución

Backend:

```bash
cd backend
npm start
```

API: http://localhost:3004. Salud: `GET /api/health`.

Frontend:

```bash
cd frontend
npm run dev
```

Aplicación: http://localhost:5173.

## Autenticación JWT

- `POST /api/auth/register`: registra una cuenta con contraseña hasheada mediante bcrypt.
- `POST /api/auth/login`: devuelve JWT y usuario público.
- `GET /api/auth/me`: valida la sesión.
- Las rutas empresariales exigen `Authorization: Bearer <token>`.
- El frontend guarda el token en `sessionStorage`, lo elimina al cerrar sesión o recibir 401 y nunca almacena contraseñas.
- `JWT_SECRET` debe existir solo como variable de entorno; HTTPS es obligatorio fuera de un entorno académico local.

## Entidades empresariales

| # | Tabla | Responsabilidad |
|---:|---|---|
| 1 | usuarios | Identidad, acceso y trazabilidad |
| 2 | categorias | Clasificación de productos |
| 3 | proveedores | Origen comercial de productos y compras |
| 4 | productos | Catálogo y total derivado de unidades |
| 5 | bodegas | Almacenes físicos |
| 6 | ubicaciones | Posiciones internas por bodega |
| 7 | existencias | Cantidad por producto y ubicación |
| 8 | tipos_movimiento | Efectos ENTRADA, SALIDA o TRASLADO |
| 9 | movimientos_inventario | Historial inmutable |
| 10 | clientes | Destinatarios de ventas |
| 11 | compras | Encabezados de recepción |
| 12 | detalles_compras | Productos, ubicación, cantidad y costo |
| 13 | ventas | Encabezados de salida |
| 14 | detalles_ventas | Productos, ubicación, cantidad y precio |
| 15 | ajustes_inventario | Correcciones auditables de cantidad |

## Relaciones principales

- Categoria 1:N Producto.
- Proveedor 1:N Producto y 1:N Compra.
- Bodega 1:N Ubicacion.
- Producto N:M Ubicacion mediante Existencia, con `UNIQUE(productoId, ubicacionId)`.
- Producto, TipoMovimiento, Usuario y ubicaciones se relacionan con MovimientoInventario.
- Cliente 1:N Venta.
- Compra 1:N DetalleCompra; cada detalle referencia Producto y Ubicacion.
- Venta 1:N DetalleVenta; cada detalle referencia Producto y Ubicacion.
- AjusteInventario referencia Producto, Ubicacion, Usuario y un MovimientoInventario único.

El diagrama completo está en [docs/diagrama-er.drawio](docs/diagrama-er.drawio).

## API REST

Todas las rutas siguientes, salvo autenticación y salud, requieren JWT.

| Recurso | Ruta base | Operaciones reales |
|---|---|---|
| Usuarios | `/api/usuarios` | Consulta y actualización de cuenta propia; POST administrativo 403 |
| Categorías | `/api/categorias` | Cinco endpoints CRUD |
| Proveedores | `/api/proveedores` | Cinco endpoints CRUD con integridad referencial |
| Productos | `/api/productos` | Cinco endpoints; cantidad solo mediante inventario |
| Bodegas | `/api/bodegas` | Cinco endpoints; DELETE desactiva |
| Ubicaciones | `/api/ubicaciones` | Cinco endpoints; DELETE desactiva si no hay dependencias |
| Existencias | `/api/existencias` | GET lista/detalle; POST, PUT y DELETE devuelven 403 |
| Tipos de movimiento | `/api/tipos-movimiento` | Cinco endpoints; DELETE desactiva |
| Movimientos | `/api/movimientos-inventario` | GET y POST; PUT y DELETE devuelven 409 |
| Clientes | `/api/clientes` | Cinco endpoints; DELETE desactiva |
| Compras | `/api/compras` | CRUD de borradores y POST `/:id/confirmar` |
| Detalles de compra | `/api/detalles-compras` | CRUD mientras la compra esté en BORRADOR |
| Ventas | `/api/ventas` | CRUD de borradores y POST `/:id/confirmar` |
| Detalles de venta | `/api/detalles-ventas` | CRUD mientras la venta esté en BORRADOR |
| Ajustes | `/api/ajustes-inventario` | GET y POST; PUT y DELETE devuelven 409 |

Existen 15 controladores de entidades. Esto no implica 15 CRUD arbitrarios completos: existencias, movimientos, ajustes, usuarios y documentos confirmados tienen restricciones deliberadas por seguridad, consistencia y trazabilidad.

La colección completa está en [docs/postman/Inventario_Empresarial.postman_collection.json](docs/postman/Inventario_Empresarial.postman_collection.json).

## Reglas de inventario

- `existencias.cantidad` es la fuente de verdad por producto y ubicación.
- `productos.cantidad` es un total derivado, actualizado en la misma transacción.
- No se permiten cantidades negativas.
- No se permite escritura directa de existencias.
- Entrada requiere destino; salida requiere origen; traslado requiere origen y destino distintos.
- Las ubicaciones y tipos utilizados deben estar activos.
- Los movimientos aplicados son inmutables y conservan el usuario responsable.
- La creación con inventario inicial crea el producto en cero y registra la entrada en una sola transacción.

## Compras y ventas

Los documentos nacen en `BORRADOR`. Mientras estén en ese estado se pueden editar encabezado y detalles. La confirmación:

1. bloquea el documento;
2. recalcula el total en backend;
3. aplica movimientos mediante el servicio de inventario;
4. actualiza existencias y total del producto;
5. registra el usuario;
6. cambia el estado a `CONFIRMADA`.

Una compra confirmada genera entradas. Una venta confirmada genera salidas y falla con 409 si no hay inventario suficiente. Documentos confirmados y sus detalles son inmutables.

## Ajustes

Un ajuste establece una nueva cantidad para un producto en una ubicación. El backend calcula la diferencia, genera una entrada o salida técnica y enlaza el ajuste con su movimiento. Los ajustes aplicados no se editan ni eliminan.

## Idempotencia

Compras, ventas y ajustes usan `claveIdempotencia`:

- repetir la misma operación con la misma clave devuelve el resultado ya aplicado;
- no se duplican movimientos ni cantidades;
- intentar confirmar un documento ya confirmado con otra clave devuelve conflicto.

## Errores HTTP

| Estado | Uso |
|---:|---|
| 200/201 | Operación correcta |
| 400 | Cuerpo, tipo, relación o regla inválida |
| 401 | JWT ausente, inválido o vencido |
| 403 | Operación expresamente no permitida |
| 404 | Recurso inexistente |
| 409 | Duplicado, dependencia, inmutabilidad o inventario insuficiente |
| 500 | Error interno controlado por middleware |

Las respuestas de error son JSON y el frontend transforma los mensajes técnicos en retroalimentación comprensible.

## Pruebas

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

El backend utiliza el Test Runner nativo de Node.js y `fetch`, sin dependencias de pruebas adicionales. La suite contiene 30 pruebas de integración para autenticación, productos, entradas, salidas, traslados, compras, ventas, ajustes, idempotencia, rollback, inmutabilidad y consistencia de cantidades.

Las pruebas requieren una base MySQL exclusiva. Copiar `backend/.env.test.example` como `backend/.env.test` y completar únicamente valores locales:

```dotenv
TEST_DB_HOST=127.0.0.1
TEST_DB_PORT=3306
TEST_DB_NAME=inventario_empresarial_test
TEST_DB_USER=<USUARIO_MYSQL_DE_PRUEBAS>
TEST_DB_PASSWORD=<CONTRASENA_MYSQL_DE_PRUEBAS>
```

La suite se detiene antes de conectarse si `TEST_DB_NAME` falta, coincide con la base principal o no termina en `_test`. En cada ejecución elimina y reconstruye exclusivamente esa base de pruebas, aplica las 17 migraciones y levanta Express en un puerto efímero. Nunca sincroniza, trunca ni migra `inventario_empresarial`.

Ejecución:

```bash
cd backend
npm test
```

Como alternativa, `TEST_DB_NAME` puede suministrarse solo para el proceso. En PowerShell:

```powershell
$env:TEST_DB_NAME='inventario_empresarial_test'
npm test
Remove-Item Env:TEST_DB_NAME
```

La base de pruebas queda disponible al terminar para inspección. La siguiente ejecución la recrea. La suite no incluye pruebas visuales ni una prueba de estrés con varias conexiones simultáneas; la concurrencia se cubre estructuralmente mediante bloqueos y transacciones y requiere una campaña separada de carga.

La colección Postman permite repetir pruebas manuales sin contener credenciales reales.

## Estructura

```text
inventario-empresarial/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── test/
│   ├── app.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       └── styles/
└── docs/
    ├── diagrama-er.drawio
    ├── investigacion_jwt_dia_2.md
    ├── arquitectura_integridad.md
    └── postman/
```

## Limitaciones conocidas

- No existen roles ni permisos; cualquier usuario autenticado accede a las operaciones empresariales.
- El mantenimiento de usuarios se limita a la cuenta propia.
- No se usan refresh tokens.
- El token en `sessionStorage` sigue siendo vulnerable ante XSS; se requiere CSP, revisión de dependencias y HTTPS en producción.
- No hay limitación de intentos de login.
- La suite de backend no sustituye pruebas de carga o estrés concurrente.
- Las pruebas visuales y responsive requieren ejecución manual o navegador automatizado.
- La anulación contable de documentos confirmados no está implementada; el historial se conserva por inmutabilidad.

## Documentación adicional

- [Arquitectura e integridad](docs/arquitectura_integridad.md)
- [Investigación JWT](docs/investigacion_jwt_dia_2.md)
- [Diagrama ER editable](docs/diagrama-er.drawio)
- [Colección Postman](docs/postman/Inventario_Empresarial.postman_collection.json)
